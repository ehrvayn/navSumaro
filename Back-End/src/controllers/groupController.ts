import type { Response, Request } from "express";
import createGroup from "../services/group/createGroup.js";
import { getAllGroup } from "../services/group/retrieveGroup.js";
import { editGroup } from "../services/group/editGroup.js";
import { joinGroup } from "../services/group/joinGroup.js";
import { leaveGroup } from "../services/group/leaveGroup.js";
import { kickMember } from "../services/group/kickMember.js";
import sendMessage from "../services/group/sendMessage.js";
import { getMessages } from "../services/group/getMessages.js";

export const createGroupController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;

  const { name, description, emoji, isPublic, managedBy } = req.body;

  if (!name || !description || !emoji) {
    return res.status(400).json({
      success: false,
      message: "Missing requirements",
    });
  }

  const result = await createGroup(req.body, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

export const retrieveAllGroupController = async (
  req: Request,
  res: Response,
) => {
  const currentUser = (req as any).user;
  const result = await getAllGroup(currentUser);

  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result.groups);
};

export const editGroupController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;

  const result = await editGroup({ ...req.body, id }, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }
  res.status(200).json(result);
};

export const joinGroupController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;
  const result = await joinGroup(id, currentUser);

  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
};

export const leaveGroupController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Group ID is required" });
  const result = await leaveGroup(id, currentUser);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
};

export const kickMemberController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { groupId, memberId } = req.params;

  if (!groupId || !memberId)
    return res
      .status(400)
      .json({ success: false, message: "Group ID and Member ID are required" });

  const result = await kickMember(groupId, { id: memberId }, currentUser);

  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
};

export const sendMessageController = async (req: Request, res: Response) => {
  const senderId = (req as any).user.id;
  const { groupId, text } = req.body;

  if (!groupId || !text) {
    return res
      .status(400)
      .json({ success: false, message: "groupId and text are required!" });
  }

  const result = await sendMessage(groupId, senderId, text);

  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  res.status(201).json(result);
};

export const getMessagesController = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res
      .status(400)
      .json({ success: false, message: "groupId is required!" });
  }

  const result = await getMessages(groupId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
};
