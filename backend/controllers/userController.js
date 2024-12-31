import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../helpers/nodemailer.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all required details." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const createdUser = await User.create({
      email,
      username,
      password: hash,
      avatar,
      isVerified: false,
    });

    await sendEmail({ email, emailType: "verify", userId: createdUser._id });

    const token = jwt.sign(
      { userId: createdUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User created successfully!",
      user: { id: createdUser._id, username, email },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error in creating user: ${error.message}` });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all details." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Account with this email doesn't exist. Please sign up.",
      });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    //token data
    const tokenData = {
      username: user.username,
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      path: "/",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 48,
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: token,
        _id: user._id,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error logging in user: ${error.message}` });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "");
    res.status(200).json({ message: "Successfully Logged out!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout" });
  }
};

export const allUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    if (!currentUserId) {
      return res.status(401).json({ message: "User id is required" });
    }

    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const filter = {
      ...keyword,
      _id: { $ne: currentUserId },
    };

    const users = await User.find(filter);

    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name) {
      return res.status(400).json("Username is required!");
    }
    const updatedName = await User.findOneAndUpdate(
      { _id: req.user._id },
      { username: name },
      { new: true }
    );
    if (!updatedName) {
      res.status(400).json({ message: "Failed to update username" });
    }
    res.status(200).send(updatedName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyemail = async (req, res) => {
  try {
    const { token } = req.params; 
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }

    user.isVerified = true;
    user.verifyToken = undefined; 
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      message: "Something went wrong during the email verification process.",
    });
  }
};
