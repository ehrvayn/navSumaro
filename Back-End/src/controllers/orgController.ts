import type { Request, Response } from "express";
import { registerOrg } from "../services/organization/registerOrg.js";
import { retrieveOrgById } from "../services/organization/retrieveOrg.js";
import { createEvent } from "../services/organization/createEvent.js";
import { retrieveAllEvents } from "../services/organization/retrieveEvents.js";
import { updateOrg } from "../services/organization/updateOrg.js";

export const registerOrgController = async (req: Request, res: Response) => {
  const orgData = req.body;

  if (
    !orgData.name ||
    !orgData.description ||
    !orgData.email ||
    !orgData.password ||
    !orgData.university ||
    !orgData.organizationType
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields!" });
  }

  const result = await registerOrg(orgData);

  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  return res.status(201).json(result);
};

export const retrieveOrgByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const result = await retrieveOrgById(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.status(200).json(result);
};

export const createEventController = async (req: Request, res: Response) => {
  const eventData = req.body;
  const { orgId } = req.params;

  const result = await createEvent(eventData, orgId);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }

  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data,
  });
};

export const retrieveAllEventsController = async (
  req: Request,
  res: Response,
) => {
  const result = await retrieveAllEvents();

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Event retrival failed!",
    });
  }
  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data,
  });
};

export const updateOrgController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;

  if (!currentUser?.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const data = req.body;

  try {
    for (const [type, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;

      const result = await updateOrg(currentUser.id, type, value, currentUser);
      if (!result.success) {
        return res.status(400).json(result);
      }
    }

    res.status(200).json({ success: true, message: "Updated successfully!" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
