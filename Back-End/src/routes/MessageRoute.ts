import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  sendMessageController,
  retrieveAllController,
  getThreadsController,
  deleteThreadController,
  markAsReadController,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessageController);
router.post("/retrieveAll", authMiddleware, retrieveAllController);
router.get("/threads", authMiddleware, getThreadsController);
router.delete("/threads/delete/:threadId", authMiddleware, deleteThreadController);
router.patch("/threads/read/:threadId", authMiddleware, markAsReadController);

export default router;