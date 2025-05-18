import express from "express";
import { onlyAdminAccess, protect } from "../middlewares/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData,
  updateTask,
  updateTaskCheckList,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

//TASK MANAGEMENT Routes
router.get("/dashboard-data", protect, onlyAdminAccess, getDashboardData); //Dashboard (Admin only)
router.get("/user-dashboard-data", protect, getUserDashboardData); //User Dashboard
router.get("/", protect, getTasks); //Tasks (Admin:all, User: assigned)
router.get("/:id", protect, getTaskById); //Single Task
router.put("/:id", protect, updateTask); //Update Task
router.put("/:id/todo", protect, updateTaskCheckList); //Update Task Checklist
router.put("/:id/status", protect, updateTaskStatus); //Update Task Status

router.delete("/:id", protect, onlyAdminAccess, deleteTask); //Delete Task (Admin only)
router.post("/", protect, onlyAdminAccess, createTask); //Create Task (Admin only)

export default router;
