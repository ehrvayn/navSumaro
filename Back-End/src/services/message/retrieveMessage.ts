import { query } from "../../database/Connection.js";
import messageQuery from "../../models/messageQuery.js";

export const retrieveAllMessages = async (threadId: any, currentUser: any) => {
  try {
    const threadResult = await query(
      `SELECT "participantOneId", "deletedAtOne", "deletedAtTwo" FROM threads WHERE id = $1`,
      [threadId]
    );

    if (threadResult.rows.length === 0) {
      return { success: false, message: "Thread not found!" };
    }

    const thread = threadResult.rows[0];
    const isParticipantOne = thread.participantOneId === currentUser.id;
    const myDeletedAt = isParticipantOne ? thread.deletedAtOne : thread.deletedAtTwo;

    const { query: sql, values } = messageQuery.retrieveAll(threadId, myDeletedAt);
    const result = await query(sql, values);

    return { success: true, message: "Messages retrieved!", data: result.rows };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong!" };
  }
};

export default retrieveAllMessages;