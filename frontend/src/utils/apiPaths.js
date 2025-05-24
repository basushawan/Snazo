export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_PATHS = {
  AUTH: {
    REGISTER: "api/auth/register", //Register
    LOGIN: "api/auth/login", //Login
    LOGOUT: "api/auth/logout", //Logout
    PROFILE: "api/auth/profile", //Profile
  },
  USERS: {
    ALL_USERS: "api/users", //All Users
    SPECIFIC_USER: (userId) => `api/users/${userId}`, //Specific User
    DELETE_USER: (userId) => `api/users/${userId}`, //Delete User
    UPDATE_USER: (userId) => `api/users/${userId}`, //Update Profile //RECHECK(will make issues)
    CREATE_USER: "api/users", //Create User (Admin only) //RECHECK(will make issues)
  },
  TASKS: {
    DASHBOARD: "api/tasks/dashboard-data", //Dashboard (Admin only)
    USER_DASHBOARD: "api/tasks/user-dashboard-data", //User Dashboard
    TASKS: "api/tasks/", //Tasks (Admin:all, User: assigned)
    SINGLE_TASK: (taskId) => `api/tasks/${taskId}`, //Single Task
    CREATE_TASK: "api/tasks", //Create Task (Admin only)
    UPDATE_TASK: (taskId) => `api/tasks/${taskId}`, //Update Task
    DELETE_TASK: (taskId) => `api/tasks/${taskId}`, //Delete Task (Admin only)
    UPDATE_TASK_STATUS: (taskId) => `api/tasks/${taskId}/status`, //Update Task Status
    UPDATE_TASK_CHECKLIST: (taskId) => `api/tasks/${taskId}/todo`, //Update Task Checklist
  },
  REPORTS: {
    ALL_REPORTS: "api/reports/downloadable/all-reports", //All Reports (Admin only)
    USER_REPORT: "api/reports/downloadable/user-report", //User Report (Admin only)
  },
  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image", //Upload Image
  },
};
