import postQuery from "../../models/postQuery.js";
import { query } from "../../database/Connection.js";

export const getAllPost = async (currentUser: any, groupId: any | null, limit = 20, offset = 0) => {
  try {
    const { query: sql, values } = postQuery.retrieveAll(currentUser.id, groupId, limit, offset);
    const result = await query(sql, values);
    return { success: true, posts: result.rows };
  } catch (err) {
    console.error("Get user error:", err);
    return { success: false, message: "Something went wrong" };
  }
};