import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUser,
  deleteUser,
  protect,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getUsers); // admin-only
router.get("/profile", protect, getUserProfile);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;

