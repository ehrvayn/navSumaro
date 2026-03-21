import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const kickMember = async (groupId: any, member: any, currentUser: any) => {
  if (!groupId) return { success: false, message: "Group ID is required" };
  if (!member?.id) return { success: false, message: "Member ID is required" };
  if (!currentUser?.id) return { success: false, message: "Unauthorized" };

  try {
    const adminCheck = await query(
      `SELECT "isAdmin" FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, currentUser.id]
    );

    if (!adminCheck.rows[0]?.isAdmin) {
      return { success: false, message: "Only admins can kick members" };
    }

    const { query: sql, values } = groupQuery.removeMember(groupId, member.id);
    await query(sql, values);
    return { success: true, message: "Member has been removed!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
};