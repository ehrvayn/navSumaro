import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const getJoinRequest = async (groupId: string) => {
  if (!groupId) return { success: false, message: "Group ID is required" };

  try {
    const { query: sql, values } = groupQuery.getJoinRequests(groupId);
    const result = await query(sql, values);

    if (result.rows.length !== 0) {
      return {
        success: true,
        message: "Group requests have been retrieved!",
        data: result.rows,
      };
    }

    return { success: false, message: "No join requests found" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
