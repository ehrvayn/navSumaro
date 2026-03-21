import retrieveAllMessages from "../services/message/retrieveMessage.js";
import type { Response, Request } from "express";
import { sendMessage } from "../services/message/sendMessage.js";
import retrieveThreads from "../services/message/retrieveThreads.js";
import { deleteThread } from "../services/message/deleteThread.js";
import { markAsRead } from "../services/message/markAsUnread.js";

export const sendMessageController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { text, recipientId } = req.body;

  if (!text || !recipientId || !currentUser?.id) {
    return res.status(400).json({ success: false, message: "Missing requirements!" });
  }

  const result = await sendMessage({ text, recipientId }, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

export const retrieveAllController = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { threadId } = req.body;

    if (!currentUser?.id) {
      return res.status(401).json({ success: false, message: "User ID is missing" });
    }

    if (!threadId) {
      return res.status(400).json({ success: false, message: "Thread ID is required" });
    }

    const result = await retrieveAllMessages(threadId, currentUser);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

export const getThreadsController = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    if (!currentUser?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const result = await retrieveThreads(currentUser);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

export const deleteThreadController = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.id;
    const { threadId } = req.params;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const result = await deleteThread(threadId, currentUserId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

export const markAsReadController = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.id;
    const { threadId } = req.params;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const result = await markAsRead(threadId, currentUserId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};