import groupQuery from "../../models/groupQuery.js";
import { query } from "../../database/Connection.js";

export const getAllGroup = async (currentUser: any) => {
  try {
    const { query: sql, values } = groupQuery.retrieveAll(currentUser.id);
    const result = await query(sql, values);
    return { success: true, groups: result.rows };
  } catch (err) {
    console.error("Retrieve group error:", err);
    return { success: false, message: "Something went wrong" };
  }
};