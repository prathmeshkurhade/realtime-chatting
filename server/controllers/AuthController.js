import { compare } from "bcryptjs";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (email, userId) => {
  return jwt.sign(
    { email, userId },
    process.env.JWT_KEY,
    { expiresIn: MAX_AGE }
  );
};

const getCookieOptions = () => ({
  maxAge: MAX_AGE * 1000,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  httpOnly: true
});

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.create({
      email,
      password,
      profileSetup: false
    });

    res.cookie("jwt", createToken(email, user.id), getCookieOptions());

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup
      }
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.email, user._id);
    res.cookie("jwt", token, getCookieOptions());

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
        profileSetup: user.profileSetup
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);

    if (!userData) {
      return res.status(404).json({
        message: "User with given ID not found"
      });
    }

    return res.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color
      }
    });
  } catch (error) {
    console.error("Error during getUserInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color, image } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "First name and last name are required"
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        image,
        profileSetup: true
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color
    });
  } catch (error) {
    console.error("Error during updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const date = Date.now();
    const fileName = `uploads/profiles/${date}_${req.file.originalname}`;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image
    });
  } catch (error) {
    console.error("Error during addProfileImage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).json({
      message: "Profile image removed successfully"
    });
  } catch (error) {
    console.error("Error during removeProfileImage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {maxAge:1, secure:true, sameSite: true })
    return res.status(200).send("user loggedout successfully")
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

