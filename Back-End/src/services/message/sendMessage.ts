import messageQuery from "../../models/messageQuery.js";
import { query } from "../../database/Connection.js";

export const sendMessage = async (messageData: any, currentUser: any) => {
  try {
    const currentUserIsOrg = currentUser.accountType === "organization";
    const recipientIsOrg = messageData.recipientIsOrg ?? false;

    const { query: threadSql, values: threadValues } =
      messageQuery.findOrCreateThread(currentUser.id, messageData.recipientId, currentUserIsOrg, recipientIsOrg);
    const insertResult = await query(threadSql, threadValues);

    let threadId: string;
    if (insertResult.rows.length > 0) {
      threadId = insertResult.rows[0].id;
    } else {
      const { query: getSql, values: getValues } =
        messageQuery.getExistingThread(currentUser.id, messageData.recipientId);
      const existing = await query(getSql, getValues);
      threadId = existing.rows[0].id;
    }

    const { query: unreadSql, values: unreadValues } =
      messageQuery.incrementUnread(threadId, messageData.recipientId);
    await query(unreadSql, unreadValues);

    const { query: msgSql, values: msgValues } =
      messageQuery.sendMessage(threadId, currentUser.id, messageData.text);
    const result = await query(msgSql, msgValues);

    const { query: lastMsgSql, values: lastMsgValues } =
      messageQuery.updateLastMessage(threadId, messageData.text);
    await query(lastMsgSql, lastMsgValues);

    if (result.rows.length === 0) {
      return { success: false, message: "Failed to send message!" };
    }

    return { success: true, message: "Message sent!", data: { ...result.rows[0], threadId } };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};