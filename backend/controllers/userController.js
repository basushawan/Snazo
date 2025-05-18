import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

// @desc All Users
// @route GET /api/users
// @access Private(onlyAdminAcess)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "-password -tokenVersion"
    );

    //Add task counts to each user using Promise.all(users)
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasksCount = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasksCount = await Task.countDocuments({
          assignedTo: user._id,
          status: "In-Progress",
        });
        const completedTasksCount = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });
        return {
          ...user._doc,
          pendingTasksCount,
          inProgressTasksCount,
          completedTasksCount,
        };
      })
    );
    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Specific User
// @route GET /api/users/:id
// @access Private(onlyAdminAcess)
export const getUserById = async (req, res) => {
  const { id } = req.params;

  //Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(req.params.id).select(
      "-password -tokenVersion"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Delete User
// @route DELETE /api/users/:id
// @access Private(onlyAdminAcess)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
