import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.route("/").post(authMiddleware, sendMessage);
router.route("/:chatId").get(authMiddleware, allMessages);

export default router;
