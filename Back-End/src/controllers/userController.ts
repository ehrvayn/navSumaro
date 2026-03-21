import type { Request, Response } from "express";
import getUserById from "../services/user/RetrieveUser.js";
import { getUser, getAllUser } from "../services/user/RetrieveUser.js";
import { updateUser } from "../services/user/UpdateUser.js";
import deleteUser from "../services/user/DeleteUser.js";

export const retrieveUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const result = await getUserById(id);

    if (result.success) {
      res.status(200).json({ success: true, data: result.user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Retrieve user by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const retrieveUser = async (req: Request, res: Response) => {
  try {
    const email = (req.query.email as string) || (req.body.email as string);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await getUser(email);

    if (result.success) {
      res.status(200).json(result.user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Retrieve user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const retrieveAllUser = async (req: Request, res: Response) => {
  try {
    const result = await getAllUser();

    if (result.success) {
      res.status(200).json(result.user);
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    console.error("Retrieve user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = (req as any).user;

  if (!currentUser?.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { type, value1 } = req.body;

  if (!type || value1 === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Missing type or value" });
  }

  const result = await updateUser(id, type, value1, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = (req as any).user;

  if (!id)
    return res.status(400).json({ success: false, message: "ID is required" });

  const result = await deleteUser(id, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
};
