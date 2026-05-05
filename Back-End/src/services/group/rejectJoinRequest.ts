import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const rejectJoinRequest = async (userId: string, groupId: string) => {
  try {
    const { query: sql, values } = groupQuery.rejectJoinRequest(userId, groupId);
    await query(sql, values);
    return { success: true, message: "Request rejected!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};