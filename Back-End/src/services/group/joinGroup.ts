import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const joinGroup = async (groupId: any, currentUser: any) => {
  if (!groupId) return { success: false, message: "Group ID is required" };
  if (!currentUser?.id) return { success: false, message: "Unauthorized" };

  try {
    const { query: sql, values } = groupQuery.addMember(groupId, currentUser.id, false);
    await query(sql, values);
    return { success: true, message: "Joined group successfully!" };
  } catch (err: any) {
    if (err.code === "23505") return { success: false, message: "Already a member" };
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};