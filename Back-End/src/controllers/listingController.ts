import type { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import {
  createListing,
  likeListing,
} from "../services/listing/createListing.js";
import { retrieveAllListings } from "../services/listing/retrieveListing.js";
import {
  createListingComment,
  retrieveListingComments,
  likeListingComment,
} from "../services/listing/commentListing.js";

export const createListingController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const sellerId = (req as any).user.id;

    const imageUrls = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, "navsumaro/listings"),
      ),
    );

    const listingData = { ...req.body, images: imageUrls };
    const result = await createListing(listingData, sellerId);
    res.json(result);
  } catch (error) {
    console.error("CONTROLLER ERROR:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const retrieveAllListingsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await retrieveAllListings(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const likeListingController = async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const { id } = req.params;

  const result = await likeListing(
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

export const createListingCommentController = async (
  req: Request,
  res: Response,
) => {
  const currentUser = (req as any).user;
  const result = await createListingComment(req.body, currentUser);
  if (!result.success) return res.status(400).json(result);
  res.status(201).json(result);
};

export const retrieveListingCommentsController = async (
  req: Request,
  res: Response,
) => {
  const { listingId } = req.params;
  const currentUser = (req as any).user;
  const result = await retrieveListingComments(listingId, currentUser.id);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result.comments);
};

export const likeListingCommentController = async (
  req: Request,
  res: Response,
) => {
  const currentUser = (req as any).user;
  const { id } = req.params;
  const result = await likeListingComment({ id }, currentUser);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
};
