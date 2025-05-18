import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Task from "../models/Task.js";

//Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      //Check if token version matches
      if (user.tokenVersion !== decoded.version) {
        return res.status(401).json({ message: "Token has been invalidated" });
      }
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "No Token Found, Authorization Failed" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid Token", error: error.message });
  }
};

//Middleware for Admin-only access
export const onlyAdminAccess = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied, Admin Only" });
  }
};
