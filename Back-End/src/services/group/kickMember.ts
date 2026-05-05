import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const kickMember = async (
  groupId: any,
  member: any,
  currentUser: any,
) => {
  if (!groupId) return { success: false, message: "Group ID is required" };
  if (!member?.id) return { success: false, message: "Member ID is required" };
  if (!currentUser?.id) return { success: false, message: "Unauthorized" };

  try {
    const { query: adminSql, values: adminValues } = groupQuery.checkIsAdmin(
      groupId,
      currentUser.id,
    );
    const adminCheck = await query(adminSql, adminValues);

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
