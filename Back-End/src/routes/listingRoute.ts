import express from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createListingController } from "../controllers/listingController.js";
import { retrieveAllListingsController } from "../controllers/listingController.js";
import { likeListingController } from "../controllers/listingController.js";
import { createListingCommentController, retrieveListingCommentsController, likeListingCommentController } from "../controllers/listingController.js";


const router = express.Router();

router.post("/create", authMiddleware, upload.array("images", 5), createListingController);
router.get("/all", authMiddleware, retrieveAllListingsController);
router.patch("/like/:id", authMiddleware, likeListingController);
router.post("/comment/create", authMiddleware, createListingCommentController);
router.get("/comment/:listingId", authMiddleware, retrieveListingCommentsController);
router.patch("/comment/like/:id", authMiddleware, likeListingCommentController);

export default router;
