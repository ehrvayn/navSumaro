import { query } from "../../database/Connection.js";
import messageQuery from "../../models/messageQuery.js";

const retrieveThreads = async (currentUser: any) => {
  try {
    const { query: sql, values } = messageQuery.getThreads(currentUser.id);
    const result = await query(sql, values);
    return { success: true, message: "Threads retrieved!", data: result.rows };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export default retrieveThreads;