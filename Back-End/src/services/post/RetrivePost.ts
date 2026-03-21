import postQuery from "../../models/postQuery.js";
import { query } from "../../database/Connection.js";

export const getAllPost = async (currentUser: any, groupId: any | null) => { 
  try {
    const { query: sql, values } = postQuery.retrieveAll(currentUser.id, groupId);
    const result = await query(sql, values);

    if (result.rows.length > 0) {
      return { success: true, posts: result.rows };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (err) {
    console.error("Get user error:", err); 
    return { success: false, message: "Something went wrong" };
  }
};