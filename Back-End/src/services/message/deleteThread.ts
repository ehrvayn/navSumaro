import { query } from "../../database/Connection.js";
import messageQuery from "../../models/messageQuery.js";

export const deleteThread = async (threadId: any, currentUserId: any) => {
  try {
    const { query: getThreadSql, values: getThreadValues } = messageQuery.getThread(threadId);
    const threadResult = await query(getThreadSql, getThreadValues);

    if (threadResult.rows.length === 0) {
      return { success: false, message: "Thread not found!" };
    }

    const thread = threadResult.rows[0];
    const isParticipantOne =
      thread.participantOneId === currentUserId ||
      thread.orgParticipantOneId === currentUserId;

    const { query: sql, values } = messageQuery.deleteThread(threadId, currentUserId, isParticipantOne);
    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return { success: false, message: "Couldn't Delete Thread!" };
    }

    return { success: true, message: "Thread Deleted Successfully!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};