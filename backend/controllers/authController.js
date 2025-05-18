import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate JWT Token
const generateToken = (userId, tokenVersion) => {
  return jwt.sign(
    { id: userId, version: tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// @desc Register
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    // if user exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Assign role(admin or user)
    const role =
      adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN
        ? "admin"
        : "user";

    //Generate hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create a new user (db user)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    //Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Login
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json("Invalid email or password");

    user.tokenVersion += 1;
    await user.save();

    //Return response with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Profile
// @route GET /api/auth/profile/
// @access Private(requires JWT)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -tokenVersion"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Update Profie
// @route PUT /api/auth/profile
// @access Private(requires JWT)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.name = req.body.name || user.name; // only update name field
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.tokenVersion),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Upload Image
// @route POST /api/auth/upload-image
// @access Private
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Uploading image failed" });
  }

  const profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImageUrl = profileImageUrl;
    await user.save();

    res
      .status(200)
      .json({ message: "Image uploaded successfully", profileImageUrl });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
