import express from "express";
import {
  allUser,
  editProfile,
  logoutUser,
  registerUser,
  verifyemail,
} from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authMiddleware, allUser);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser).get(authMiddleware);
router.route("/logout").post(logoutUser);
router.route("/editprofile").put(authMiddleware, editProfile);
router.route("/verify/:token").get(verifyemail);

export default router;
