import { query } from "../../database/Connection.js";
import orgQuery from "../../models/orgQuery.js";
import bcrypt from "bcrypt";

export const updateOrg = async (
  id: any,
  type: string,
  value1: any,
  currentUser: any,
) => {
  if (!currentUser.id) {
    return { success: false, message: "User ID is required" };
  }
  if (currentUser.id !== id) {
    return { success: false, message: "Unauthorized" };
  }
  if (type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value1)) {
      return { success: false, message: "Invalid email format" };
    }
  }
  try {
    let sql: string = "";
    let values: any[] = [];

    if (type === "name") {
      const result = orgQuery.updateName(id, value1);
      sql = result.query;
      values = result.values;
    } else if (type === "email") {
      const result = orgQuery.updateEmail(id, value1);
      sql = result.query;
      values = result.values;
    } else if (type === "university") {
      const result = orgQuery.updateUniversity(id, value1);
      sql = result.query;
      values = result.values;
    } else if (type === "description") {
      const result = orgQuery.updateDescription(id, value1);
      sql = result.query;
      values = result.values;
    } else if (type === "organizationType") {
      const result = orgQuery.updateOrgType(id, value1);
      sql = result.query;
      values = result.values;
    } else if (type === "password") {
      const hashedPassword = await bcrypt.hash(value1, 10);
      const result = orgQuery.updatePassword(id, hashedPassword);
      sql = result.query;
      values = result.values;
    } else {
      return { success: false, message: "Invalid update type" };
    }

    const updateResult = await query(sql, values);
    console.log("Updated rows:", updateResult.rowCount);
    return { success: true, message: "Updated successfully!" };
  } catch (err) {
    console.error("Update error:", err);
    return { success: false, message: "Something went wrong" };
  }
};