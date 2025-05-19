import mongoose from "mongoose";
import Task from "../models/Task.js";

// @desc Tasks (Admin:all, User:only assigned tasks)
// @route GET /api/tasks/
// @access Private
export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    //Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (i) => i.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    //Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In-Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Single Task
// @route GET /api/tasks/
// @access Private
export const getTaskById = async (req, res) => {
  const { id } = req.params;

  //Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Create Task
// @route POST /api/tasks/
// @access Private (onlyAdminAcess)
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    //Assign tasks to users as an array of user ids
    if (!Array.isArray(assignedTo))
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user ids" });

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      attachments,
      todoChecklist,
      assignedTo,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Update Task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;
    if (req.body.assignedTo) {
      //Admin only can assign tasks to users
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admin can assign tasks to users" });
      }
      if (!Array.isArray(req.body.assignedTo))
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user ids" });
      task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();
    res.json({ message: "Task updated suceessfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Delete Task
// @route DELETE /api/tasks/:id
// @access Private (onlyAdminAcess)
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  //Admin only can assign tasks to users
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can delete tasks to users" });
  }
  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });

  try {
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Update Task Status
// @route PUT /api/tasks/:id/status
// @access Private
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (uid) => uid.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    task.status = req.body.status || task.status;
    if (task.status === "Completed") {
      task.todoChecklist.forEach((i) => (i.completed = true));
      task.progress = 100;
    }
    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Update Task Checklist
// @route PUT /api/tasks/:id/todo
// @access Private
export const updateTaskCheckList = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Not authorized to update checklist" });

    //Updated Checklist
    task.todoChecklist = todoChecklist;
    //Auto update checklist based on checklist completion
    const completedCount = task.todoChecklist.filter((i) => i.completed).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    //Auto-mark task as completed (if all items are checked)
    if (task.progress === 100) task.status = "Completed";
    else if (task.progress > 100) task.status = "In-Progress";
    else task.status = "Pending";

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc User Dashboard
// @route GET /api/tasks/user-dashboard-data/
// @access Private
export const getUserDashboardData = async (req, res) => {
  try {
    //Get data of loggedin user only
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const dueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    //Task distribution by status
    const taskStatuses = ["Pending", "In-Progress", "Completed"];
    const taskDistRow = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskDist = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //Remove spaces for response keys
      acc[formattedKey] = taskDistRow.find((i) => i._id === status)?.count || 0;
      return acc;
    }, {});
    //Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRow = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRow.find((i) => i._id === priority)?.count || 0;
      return acc;
    }, {});
    //Get latest 10 tasks for loggedin user only
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        dueTasks,
      },
      charts: {
        taskDist,
        taskPriorityLevels,
      },
      recentTasks,
      // _id: userId,
    });
    taskDist["All"] = totalTasks; //Add total count to taskDist
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Dashboard (Admin only)
// @route GET /api/tasks/dashboard-data/
// @access Private (onlyAdminAccess)
export const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const dueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    //Ensure all possible statuses are included
    const taskStatuses = ["Pending", "In-Progress", "Completed"];
    const taskDistRow = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDist = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //Remove spaces for response keys
      acc[formattedKey] = taskDistRow.find((i) => i._id === status)?.count || 0;
      return acc;
    }, {});
    taskDist["All"] = totalTasks; //Add total count to taskDist

    //Ensure all priority levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRow = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRow.find((i) => i._id === priority)?.count || 0;
      return acc;
    }, {});
    //Get latest 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        dueTasks,
      },
      charts: {
        taskDist,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
