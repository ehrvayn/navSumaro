import { query } from "../../database/Connection.js";
import listingQuery from "../../models/listingQuery.js";

export const createListing = async (listingData: any, sellerId: any) => {
  try {
    const { query: sql, values } = listingQuery.create(listingData, sellerId);
    const result = await query(sql, values);
    if (result.rowCount === 0) {
      return { success: false, message: "Listing Creation failed!" };
    }
    return {
      success: true,
      message: "Listing created successfuly!",
      data: result.rows,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export const likeListing = async (listingData: any, currentUser: any) => {
  if (!listingData.id)
    return { success: false, message: "listing ID is required" };
  if (!currentUser?.id)
    return { success: false, message: "Seller ID is required" };

  const { id: listingId } = listingData;
  const sellerId = currentUser.id;

  try {
    const { query: getSql, values: getValues } = listingQuery.getLike(
      listingId,
      sellerId,
    );
    const existing = await query(getSql, getValues);
    const alreadyLiked = existing.rows.length > 0;

    const amount = alreadyLiked ? -1 : 1;

    if (alreadyLiked) {
      const { query: sql, values } = listingQuery.deleteLike(listingId, sellerId);
      await query(sql, values);
    } else {
      const { query: sql, values } = listingQuery.insertLike(listingId, sellerId);
      await query(sql, values);
    }

    const { query: incrSql, values: incrValues } = listingQuery.incrementLikes(
      listingId,
      amount,
    );
    const updated = await query(incrSql, incrValues);

    return {
      success: true,
      listing: {
        ...updated.rows[0],
        liked: !alreadyLiked,
      },
    };
  } catch (err) {
    console.error("like listing error:", err);
    return { success: false, message: "Something went wrong" };
  }
};
