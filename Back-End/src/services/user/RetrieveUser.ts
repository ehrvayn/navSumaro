import { query } from "../../database/Connection.js";
import usersQuery from "../../models/userQuery.js";

const getUserById = async (
  id: any,
): Promise<{ success: boolean; user?: any; message?: string }> => {
  try {
    const { query: sql, values } = usersQuery.retrieveWithBadges(id);
    const result = await query(sql, values);

    if (result.rows.length > 0) {
      return { success: true, user: result.rows[0] };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (err) {
    console.error("Get user by ID error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const getUser = async (
  email: string,
): Promise<{ success: boolean; user?: any; message?: string }> => {
  try {
    const { query: sql, values } = usersQuery.retrieve(email);
    const result = await query(sql, values);

    if (result.rows.length > 0) {
      return { success: true, user: result.rows[0] };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (err) {
    console.error("Get user error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const getAllUser = async () => {
  try {
    const { query: sql } = usersQuery.retrieveAll();
    const result = await query(sql);

    if (result.rows.length > 0) {
      return { success: true, user: result.rows };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (err) {
    console.error("Get user error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default getUserById;
