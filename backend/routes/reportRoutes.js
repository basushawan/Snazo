import express from "express";
import { onlyAdminAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/downloadable/all-reports", protect, onlyAdminAccess); //All Reports (Admin only)
router.get("/downloadable/user-report", protect, onlyAdminAccess); //User Report (Admin only)
export default router;
