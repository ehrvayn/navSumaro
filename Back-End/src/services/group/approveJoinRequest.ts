import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const approveJoinRequest = async (
  groupId: string,
  userId: string,
  currentUser: any,
) => {
  if (!groupId || !userId)
    return { success: false, message: "Missing required fields" };
  if (!currentUser?.id) return { success: false, message: "Unauthorized" };

  try {
    const { query: adminSql, values: adminValues } = groupQuery.checkIsAdmin(
      groupId,
      currentUser.id,
    );
    const adminCheck = await query(adminSql, adminValues);

    if (!adminCheck.rows[0]?.isAdmin) {
      return { success: false, message: "Only admins can approve requests" };
    }

    const { query: sql1, values: values1 } = groupQuery.acceptRequest(
      groupId,
      userId,
    );
    await query(sql1, values1);

    const { query: sql2, values: values2 } = groupQuery.addMember(
      groupId,
      userId,
      false,
    );
    await query(sql2, values2);

    return { success: true, message: "Request approved!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};
