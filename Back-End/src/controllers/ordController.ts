import type { Request, Response } from "express";
import { registerOrg } from "../services/organization/registerOrg.js";
import { retrieveOrgById } from "../services/organization/retrieveOrg.js";

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
    return res.status(400).json({ success: false, message: "Missing required fields!" });
  }

  const result = await registerOrg(orgData);

  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  return res.status(201).json(result);
};

export const retrieveOrgByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await retrieveOrgById(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.status(200).json(result);
};