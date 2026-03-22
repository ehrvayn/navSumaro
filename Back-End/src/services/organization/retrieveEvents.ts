import { query } from "../../database/Connection.js";
import orgQuery from "../../models/orgQuery.js";

export const retrieveAllEvents = async () => {
  try {
    const { query: sql, values } = orgQuery.retrieveAllEvents();
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: false, message: "Couldn't Retrieve events!" };
    }
    return {
      success: true,
      message: "Events retirieved succesfuly!",
      data: result.rows,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
