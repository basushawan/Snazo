import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  uploadImage,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

//Auth Routes
router.post("/register", registerUser); //Register
router.post("/login", loginUser); //Login
router.post("/logout", protect, logoutUser); //Logout
router.get("/profile", protect, getUserProfile); //Profile
router.put("/profile", protect, updateUserProfile); //Update Profile
router.post("/upload-image", protect, upload.single("image"), uploadImage); //Upload Image

export default router;
