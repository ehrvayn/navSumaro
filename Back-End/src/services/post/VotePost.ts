import { query } from "../../database/Connection.js";
import postQuery from "../../models/postQuery.js";

export const votePost = async (postData: any, currentUser: any) => {
  if (!postData.id) return { success: false, message: "Post ID is required" };
  if (!currentUser?.id) return { success: false, message: "User ID is required" };

  const { id: postId, type } = postData;
  const userId = currentUser.id;

  try {
    const { query: getVoteSql, values: getVoteValues } = postQuery.getVote(postId, userId);
    const existing = await query(getVoteSql, getVoteValues);
    const existingVote = existing.rows[0]?.type ?? null;

    let voteIncrement = 0;
    let userVote: string | null = null;

    if (existingVote === type) {
      const { query: sql, values } = postQuery.deleteVote(postId, userId);
      await query(sql, values);
      voteIncrement = type === "up" ? -1 : 1;
      userVote = null;
    } else if (existingVote === null) {
      const { query: sql, values } = postQuery.upsertVote(postId, userId, type);
      await query(sql, values);
      voteIncrement = type === "up" ? 1 : -1;
      userVote = type;
    } else {
      const { query: sql, values } = postQuery.upsertVote(postId, userId, type);
      await query(sql, values);
      voteIncrement = type === "up" ? 2 : -2;
      userVote = type;
    }

    const { query: incrSql, values: incrValues } = postQuery.incrementVote(postId, voteIncrement);
    const updated = await query(incrSql, incrValues);

    return {
      success: true,
      post: {
        ...updated.rows[0],
        userVote,
      },
    };
  } catch (err) {
    console.error("vote error:", err);
    return { success: false, message: "Something went wrong" };
  }
};