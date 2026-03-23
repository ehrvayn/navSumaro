import createPost from "../services/post/CreatePost.js";
import type { Request, Response } from "express";
import { getAllPost } from "../services/post/RetrivePost.js";
import deletePost from "../services/post/DeletePost.js";
import updatePost from "../services/post/UpdatePost.js";
import { votePost } from "../services/post/VotePost.js";

export const createPostController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const result = await createPost(
    req.body,
    currentUser,
    req.body.groupId ?? null,
  );

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

export const retrieveAllPost = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const groupId = req.query.groupId as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await getAllPost(currentUser, groupId ?? null, limit, offset);

    if (result.success) {
      res.status(200).json(result.posts);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Retrieve post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = (req as any).user;

  if (!currentUser?.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Post ID is required" });
  }

  const result = await deletePost(id, currentUser.id);

  if (!result.success) {
    const status = result.message.includes("unauthorized") ? 403 : 404;
    return res.status(status).json(result);
  }

  res.status(200).json(result);
};

export const updatePostController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;
  if (!currentUser?.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const result = await updatePost({ ...req.body, id }, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

export const votePostController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;
  const { type } = req.body;

  const result = await votePost(
    {
      id,
      type,
    },
    currentUser,
  );

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
};
