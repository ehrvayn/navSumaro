import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerOrgController } from "../controllers/ordController.js";
import { retrieveOrgByIdController } from "../controllers/ordController.js";

const router = express.Router();

router.post("/register", registerOrgController);
router.get("/retrieve/:id", authMiddleware, retrieveOrgByIdController);

export default router;
