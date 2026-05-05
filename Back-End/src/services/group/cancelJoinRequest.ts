import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const cancelJoinRequest = async (groupId: string, userId: string) => {
  try {
    const { query: sql, values } = groupQuery.canceJoinRequest(userId, groupId);
    await query(sql, values);
    return { success: true, message: "Request to join is cancelled" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
