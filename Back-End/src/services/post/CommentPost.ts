import { query } from "../../database/Connection.js";
import commentQuery from "../../models/commentQuery.js";

export const create = async (commentData: any, currentUser: any) => {
  console.log("currentUser in create:", currentUser);
  if (!commentData.postId)
    return { success: false, message: "Post ID is required" };
  if (!currentUser?.id)
    return { success: false, message: "User ID is required" };
  if (!commentData.text)
    return { success: false, message: "Comment text is required" };

  try {
    const { query: insertSql, values: insertValues } = commentQuery.create(
      commentData,
      currentUser.id,
    );
    const result = await query(insertSql, insertValues);

    const { query: incrSql, values: incrValues } = commentQuery.incrementCount(
      commentData.postId,
    );
    await query(incrSql, incrValues);

    const comment = {
      ...result.rows[0],
      author: {
        id: currentUser.id,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        avatar: currentUser.avatar,
        program: currentUser.program,
        accountType: currentUser.accountType,
        isOnline: false,
      },
      likes: 0,
      liked: false,
    };

    return { success: true, comment };
  } catch (err) {
    console.error("comment error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const retrieveComments = async (postId: any, userId: string) => {
  if (!postId) return { success: false, message: "Post ID is required" };
  try {
    const { query: sql, values } = commentQuery.retrieveAll(postId, userId);
    const result = await query(sql, values);
    return { success: true, comments: result.rows };
  } catch (err) {
    console.error("retrieve comments error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const likeComment = async (commentData: any, currentUser: any) => {
  if (!commentData.id)
    return { success: false, message: "Comment ID is required" };
  if (!currentUser?.id)
    return { success: false, message: "User ID is required" };

  const { id: commentId } = commentData;
  const userId = currentUser.id;

  try {
    const { query: getSql, values: getValues } = commentQuery.getLike(
      commentId,
      userId,
    );
    const existing = await query(getSql, getValues);
    const alreadyLiked = existing.rows.length > 0;

    const amount = alreadyLiked ? -1 : 1;

    if (alreadyLiked) {
      const { query: sql, values } = commentQuery.deleteLike(commentId, userId);
      await query(sql, values);
    } else {
      const { query: sql, values } = commentQuery.insertLike(commentId, userId);
      await query(sql, values);
    }

    const { query: incrSql, values: incrValues } = commentQuery.incrementLikes(
      commentId,
      amount,
    );
    const updated = await query(incrSql, incrValues);

    return {
      success: true,
      comment: {
        ...updated.rows[0],
        liked: !alreadyLiked,
      },
    };
  } catch (err) {
    console.error("like comment error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteComment = async (id: any, currentUser: any) => {
  if (!currentUser?.id)
    return { success: false, message: "User ID is required" };
  try {
    const { query: sql, values } = commentQuery.delete(id, currentUser.id);
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Comment not found or you are not authorized to delete it",
      };
    }

    return { success: true, message: "Comment Deleted!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};
