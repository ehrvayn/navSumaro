import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerOrgController } from "../controllers/orgController.js";
import { retrieveOrgByIdController } from "../controllers/orgController.js";
import { createEventController } from "../controllers/orgController.js";
import { retrieveAllEventsController } from "../controllers/orgController.js";
import { updateOrgController } from "../controllers/orgController.js";

const router = express.Router();

router.post("/register", registerOrgController);
router.get("/retrieve/:id", authMiddleware, retrieveOrgByIdController);
router.post("/event/create/:orgId", authMiddleware, createEventController);
router.get("/event/retrieveAll", authMiddleware, retrieveAllEventsController)
router.put("/update", authMiddleware, updateOrgController);

export default router;
