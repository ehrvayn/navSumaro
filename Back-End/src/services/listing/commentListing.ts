import { query } from "../../database/Connection.js";
import listingCommentQuery from "../../models/commentListingQuery.js";

export const createListingComment = async (commentData: any, currentUser: any) => {
  if (!commentData.postId) return { success: false, message: "Listing ID is required" };
  if (!currentUser?.id) return { success: false, message: "User ID is required" };
  if (!commentData.text) return { success: false, message: "Comment text is required" };

  try {
    const { query: insertSql, values: insertValues } = listingCommentQuery.create(commentData, currentUser.id);
    const result = await query(insertSql, insertValues);

    const { query: incrSql, values: incrValues } = listingCommentQuery.incrementCount(commentData.postId);
    await query(incrSql, incrValues);

    const comment = {
      ...result.rows[0],
      author: {
        id: currentUser.id,
        accountType: currentUser.accountType,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        avatar: currentUser.avatar ?? null,
        program: currentUser.program,
        isOnline: false,
        isVerified: currentUser.isVerified ?? false,
      },
      likes: 0,
      liked: false,
    };

    return { success: true, comment };
  } catch (err) {
    console.error("listing comment error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const retrieveListingComments = async (listingId: any, userId: string) => {
  if (!listingId) return { success: false, message: "Listing ID is required" };
  try {
    const { query: sql, values } = listingCommentQuery.retrieveAll(listingId, userId);
    const result = await query(sql, values);
    return { success: true, comments: result.rows };
  } catch (err) {
    console.error("retrieve listing comments error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const likeListingComment = async (commentData: any, currentUser: any) => {
  if (!commentData.id) return { success: false, message: "Comment ID is required" };
  if (!currentUser?.id) return { success: false, message: "User ID is required" };

  const { id: commentId } = commentData;
  const userId = currentUser.id;

  try {
    const { query: getSql, values: getValues } = listingCommentQuery.getLike(commentId, userId);
    const existing = await query(getSql, getValues);
    const alreadyLiked = existing.rows.length > 0;
    const amount = alreadyLiked ? -1 : 1;

    if (alreadyLiked) {
      const { query: sql, values } = listingCommentQuery.deleteLike(commentId, userId);
      await query(sql, values);
    } else {
      const { query: sql, values } = listingCommentQuery.insertLike(commentId, userId);
      await query(sql, values);
    }

    const { query: incrSql, values: incrValues } = listingCommentQuery.incrementLikes(commentId, amount);
    const updated = await query(incrSql, incrValues);

    return { success: true, comment: { ...updated.rows[0], liked: !alreadyLiked } };
  } catch (err) {
    console.error("like listing comment error:", err);
    return { success: false, message: "Something went wrong" };
  }
};