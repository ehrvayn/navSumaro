import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const requestJoin = async (userId: string, groupId: any) => {
  if (!userId) return { success: false, message: "Unauthorized" };
  if (!groupId) return { success: false, message: "Group ID is required" };
  try {
    const { query: sql, values } = groupQuery.requestJoin(userId, groupId);
    await query(sql, values);

    return { success: true, message: "Request sent" };
  } catch (error: any) {
    console.log(error);

    if (error.code === "23505") {
      return {
        success: false,
        message: "You already requested to join this group",
      };
    }

    return { success: false, message: "Something went wrong" };
  }
};
