import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createGroupController } from "../controllers/groupController.js";
import { retrieveAllGroupController } from "../controllers/groupController.js";
import { editGroupController } from "../controllers/groupController.js";
import { joinGroupController } from "../controllers/groupController.js";
import { leaveGroupController } from "../controllers/groupController.js";
import { kickMemberController } from "../controllers/groupController.js";
import { sendMessageController } from "../controllers/groupController.js";
import { getMessagesController } from "../controllers/groupController.js";

const router = express.Router();

router.post("/create", authMiddleware, createGroupController);
router.get("/retrieveAll", authMiddleware, retrieveAllGroupController);
router.put("/edit/:id", authMiddleware, editGroupController);
router.post("/join/:id", authMiddleware, joinGroupController);
router.delete("/leave/:id", authMiddleware, leaveGroupController);
router.delete("/kick/:groupId/:memberId", authMiddleware, kickMemberController);
router.post("/send", authMiddleware, sendMessageController);
router.get("/messages/get/:groupId", authMiddleware, getMessagesController)

export default router;
