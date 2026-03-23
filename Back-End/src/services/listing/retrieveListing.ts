import { query } from "../../database/Connection.js";
import listingQuery from "../../models/listingQuery.js";

export const retrieveAllListings = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit;
    const { query: sql, values } = listingQuery.retrieveAllListings(
      limit,
      offset,
    );
    const result = await query(sql, values);
    return { success: true, data: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
