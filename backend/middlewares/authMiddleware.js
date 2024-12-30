import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "You need to login first" });
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid or expired token" });
  }
};
