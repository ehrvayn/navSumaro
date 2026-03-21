import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

export const getMessages = async (groupId: any) => {
  try {
    const { query: sql, values } = groupQuery.getMessages(groupId);
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: true, message: "No messages!", data: [] };
    }
    return { success: true, message: "Messages retrieved!", data: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};