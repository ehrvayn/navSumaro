import groupQuery from "../../models/groupQuery.js";
import { query } from "../../database/Connection.js";

const sendGroupMessage = async (groupId: any, senderId: any, text: any) => {
  try {
    const { query: sql, values } = groupQuery.sendMessage(
      groupId,
      senderId,
      text,
    );
    const result = await query(sql, values);
    if (result.rowCount === 0) {
      return { success: false, message: "Message not sent!" };
    }
    return {
      success: true,
      message: "Message Sent!",
      data: result.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};

export default sendGroupMessage;
