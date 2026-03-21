import { query } from "../../database/Connection.js";
import usersQuery from "../../models/userQuery.js";

const deleteUser = async (id: any, currentUser: any) => {
  if (!currentUser.id) {
    return { success: false, message: "User ID is required" };
  }

  if (currentUser.id !== id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const { query: sql, values } = usersQuery.delete(id);
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: false, message: "User not found or already deleted" };
    }

    return { success: true, message: "Account deleted successfully!" };
  } catch (err) {
    console.error("Error: ", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default deleteUser;
