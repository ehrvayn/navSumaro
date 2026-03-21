import { query } from "../../database/Connection.js";
import postQuery from "../../models/postQuery.js";

const updatePost = async (postData: any, currentUser: any) => {
  if (!postData.id) return { success: false, message: "Post ID is required" };
  if (!currentUser?.id) return { success: false, message: "Unauthorized" };

  try {
    const { query: sql, values } = postQuery.update({
      ...postData,
      userId: currentUser.id,
    });
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Post not found or unauthorized" };
    }

    return { success: true, post: result.rows[0] };
  } catch (err) {
    console.error("Edit post error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default updatePost;
