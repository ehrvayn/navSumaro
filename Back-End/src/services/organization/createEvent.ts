import { query } from "../../database/Connection.js";
import orgQuery from "../../models/orgQuery.js";

export const createEvent = async (eventData: any, orgId: any) => {
  try {
    const { query: sql, values } = orgQuery.createEvent(eventData, orgId);
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: false, message: "Event creation failed!" };
    }
    return {
      success: true,
      message: "Event created successfully!",
      data: result.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};