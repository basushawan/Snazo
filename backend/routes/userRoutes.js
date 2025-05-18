import express from "express";
import { onlyAdminAccess, protect } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/userController.js";

const router = express.Router();

//USER MANAGEMENT Routes - Admin Only (onlyAdminAccess)
router.get("/", protect, onlyAdminAccess, getUsers); //All Users
router.get("/:id", protect, onlyAdminAccess, getUserById); //Specific User
router.delete("/:id", protect, onlyAdminAccess, deleteUser); //Delete User

export default router;
