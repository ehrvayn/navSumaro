import type { Request, Response } from "express";
import { create, deleteComment, likeComment } from "../services/post/CommentPost.js";
import { retrieveComments } from "../services/post/CommentPost.js";

export const createCommentController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const result = await create(req.body, currentUser);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
};

export const retrieveCommentsController = async (
  req: Request,
  res: Response,
) => {
  const { postId } = req.params;
  const currentUser = (req as any).user;
  const result = await retrieveComments(postId, currentUser.id);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result.comments);
};

export const likeCommentController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;

  const result = await likeComment(
    {
      id,
    },
    currentUser,
  );

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = (req as any).user;
  const result = await deleteComment(id, currentUser)

  if (!result.success) {
    return res.status(400).json(result);
  }
  res.status(200).json(result);
};
