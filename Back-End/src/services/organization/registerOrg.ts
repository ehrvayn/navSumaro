import bcrypt from "bcrypt";
import { query } from "../../database/Connection.js";
import orgQuery from "../../models/orgQuery.js";

export const registerOrg = async (orgData: any) => {
  try {
    const hashedPassword = await bcrypt.hash(orgData.password, 10);
    const { query: sql, values } = orgQuery.register({
      ...orgData,
      password: hashedPassword,
    });
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: false, message: "Registration failed!" };
    }
    return {
      success: true,
      message: "Organization registered successfully!",
      data: result.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
