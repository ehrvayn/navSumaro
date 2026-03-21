import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createPostController } from "../controllers/postController.js";
import { retrieveAllPost } from "../controllers/postController.js";
import { deletePostController } from "../controllers/postController.js";
import { updatePostController } from "../controllers/postController.js";
import { votePostController } from "../controllers/postController.js";
import { createCommentController } from "../controllers/commentController.js";
import { retrieveCommentsController } from "../controllers/commentController.js";
import { likeCommentController } from "../controllers/commentController.js";
import { deleteCommentController } from "../controllers/commentController.js";

const router = express.Router();

router.post("/create", authMiddleware, createPostController)
router.get("/retrieveAll", authMiddleware, retrieveAllPost)
router.delete("/delete/:id", authMiddleware, deletePostController)
router.put("/update/:id", authMiddleware, updatePostController)
router.post("/vote/:id", authMiddleware, votePostController)
router.post("/comment/create", authMiddleware, createCommentController)
router.get("/comment/retrieve/:postId", authMiddleware, retrieveCommentsController)
router.post("/comment/like/:id", authMiddleware, likeCommentController)
router.delete("/comment/delete/:id", authMiddleware, deleteCommentController);

export default router;