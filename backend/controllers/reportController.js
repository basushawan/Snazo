import excelJs from "exceljs";
import Task from "../models/Task.js";
import User from "../models/User.js";

// @decs All Reports (Admin only)
// @route GET api/reports/downloadable/all-reports
// @access Private (OnlyAdminAccess)
export const getAllReports = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const book = new excelJs.Workbook();
    const sheet = book.addWorksheet("Report");
    sheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "Due Date", key: "dueDate", width: 20 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      sheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="all_reports.xlsx"'
    );
    return book.xlsx.write(res).then(() => res.end());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while downloading tasks", error: error.message });
  }
};

// @decs User Report (Admin only)
// @route GET api/reports/downloadable/user-report
// @access Private (OnlyAdminAccess)
export const getUserReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((user) => {
          if (userTaskMap[user._id]) {
            userTaskMap[user._id].taskCount += 1;
            if (task.status === "Pending")
              userTaskMap[user._id].pendingTasks += 1;
            else if (task.status === "In-Progress")
              userTaskMap[user._id].inProgressTasks += 1;
            else if (task.status === "Completed")
              userTaskMap[user._id].completedTasks += 1;
          }
        });
      }
    });

    const book = new excelJs.Workbook();
    const sheet = book.addWorksheet("Report");
    sheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In-Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];
    Object.values(userTaskMap).forEach((user) => sheet.addRow(user));
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="user_report.xlsx"'
    );
    return book.xlsx.write(res).then(() => res.end());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while downloading tasks", error: error.message });
  }
};
