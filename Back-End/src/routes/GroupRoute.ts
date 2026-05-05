import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getMessagesController,
  createGroupController,
  requestJoinController,
  editGroupController,
  retrieveAllGroupController,
  sendMessageController,
  kickMemberController,
  joinGroupController,
  leaveGroupController,
  getJoinRequestController,
  approveJoinRequestController,
  cancelJoinRequestController,
  rejectJoinRequestController
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/create", authMiddleware, createGroupController);
router.get("/retrieveAll", authMiddleware, retrieveAllGroupController);
router.put("/edit/:id", authMiddleware, editGroupController);
router.post("/join/:id", authMiddleware, joinGroupController);
router.delete("/leave/:id", authMiddleware, leaveGroupController);
router.delete("/kick/:groupId/:memberId", authMiddleware, kickMemberController);
router.post("/send", authMiddleware, sendMessageController);
router.get("/messages/get/:groupId", authMiddleware, getMessagesController);
router.post("/request-join/:groupId", authMiddleware, requestJoinController);
router.get("/get-requests/:groupId", authMiddleware, getJoinRequestController);
router.put("/approve-request/:groupId/:userId", authMiddleware, approveJoinRequestController);
router.delete("/cancel-request/:groupId/:userId", authMiddleware, cancelJoinRequestController);
router.delete("/reject-request/:groupId/:userId", authMiddleware, rejectJoinRequestController);

export default router;
