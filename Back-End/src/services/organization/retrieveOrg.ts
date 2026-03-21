import { query } from "../../database/Connection.js";
import orgQuery from "../../models/orgQuery.js";

export const retrieveOrgById = async (id: any) => {
  try {
    const { query: sql, values } = orgQuery.retrieveById(id);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Organization not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};