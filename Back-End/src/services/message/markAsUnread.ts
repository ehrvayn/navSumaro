import { query } from "../../database/Connection.js";
import messageQuery from "../../models/messageQuery.js";

export const markAsRead = async (threadId: any, userId: string) => {
  try {
    const { query: sql, values } = messageQuery.markAsRead(threadId, userId);
    await query(sql, values);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};