import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { login, register } from "../controllers/authController.js";
import { updateUserController } from "../controllers/userController.js";
import { deleteUserController } from "../controllers/userController.js";
import {
  retrieveUserById,
  retrieveUser,
  retrieveAllUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete/:id", authMiddleware, deleteUserController);
router.get("/retrieve", authMiddleware, retrieveUser);
router.get("/retrieveAll", authMiddleware, retrieveAllUser);
router.get("/retrieve/:id", authMiddleware, retrieveUserById);
router.put("/updateUser/:id", authMiddleware, updateUserController);

export default router;
