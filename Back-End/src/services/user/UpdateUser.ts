import { query } from "../../database/Connection.js";
import usersQuery from "../../models/userQuery.js";
import bcrypt from "bcrypt";

export const updateUser = async (
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

    if (type === "firstname") {
      ({ query: sql, values } = usersQuery.updateFirstname(id, value1));
    } else if (type === "lastname") {
      ({ query: sql, values } = usersQuery.updateLastname(id, value1));
    } else if (type === "email") {
      ({ query: sql, values } = usersQuery.updateEmail(id, value1));
    } else if (type === "university") {
      ({ query: sql, values } = usersQuery.updateUniversity(id, value1));
    } else if (type === "program") {
      ({ query: sql, values } = usersQuery.updateProgram(id, value1));
    } else if (type === "yearLevel") {
      ({ query: sql, values } = usersQuery.updateYearLevel(id, value1));
    } else if (type === "password") {
      const hashedPassword = await bcrypt.hash(value1, 10);
      ({ query: sql, values } = usersQuery.updatePassword(id, hashedPassword));
    } else {
      return { success: false, message: "Invalid update type" };
    }

    await query(sql, values);
    return { success: true, message: "Updated successfully!" };
  } catch (err) {
    console.error("Update error:", err);
    return { success: false, message: "Something went wrong" };
  }
};
