import { query } from "../../database/Connection.js";
import postQuery from "../../models/postQuery.js";

const createPost = async (postData: any, currentUser: any, groupId: any | null) => {
  try {
    const studentAuthorId = currentUser.accountType === "student" ? currentUser.id : null;
    const orgAuthorId = currentUser.accountType === "organization" ? currentUser.id : null;

    const { query: sql, values } = postQuery.create({
      ...postData,
      studentAuthorId,
      orgAuthorId,
      groupId: groupId ?? null,
    });

    const result = await query(sql, values);
    return { success: true, post: result.rows[0] };
  } catch (err) {
    console.error("Create post error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default createPost;
