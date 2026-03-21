import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const leaveGroup = async (groupId: any, currentUser: any) => {
  if (!groupId) return { success: false, message: "Group ID is required" };
  if (!currentUser?.id) return { success: false, message: "Unauthorized" };

  try {
    const { query: sql, values } = groupQuery.removeMember(groupId, currentUser.id);
    await query(sql, values);
    return { success: true, message: "Left group successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};