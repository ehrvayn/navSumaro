import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const editGroup = async (groupData: any, currentUser: any) => {
  if (!groupData.id) {
    return { success: false, message: "Group ID is required" };
  }

  try {
    const { query: sql, values } = groupQuery.editGroup(groupData);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Edit group failed!",
      };
    }
    return {success: true, groupData: result.rows}
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};
