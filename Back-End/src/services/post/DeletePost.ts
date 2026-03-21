import { query } from "../../database/Connection.js";
import postQuery from "../../models/postQuery.js";

const deletePost = async (postId: any, userId: any) => {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  try {
    const { query: sql, values } = postQuery.delete(postId, userId);
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: false, message: "Post not found or unauthorized" };
    }

    return { success: true, message: "Post deleted successfully!" };
  } catch (err) {
    console.error("Error during deletePost:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default deletePost;
