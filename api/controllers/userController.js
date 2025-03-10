import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields." });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Please provide both email and password." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) {
      updateFields.email = email;
    }
    if (phone) updateFields.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both old and new passwords." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or failed to update password." });
    }

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
