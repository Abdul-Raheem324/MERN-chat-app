import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  chatBotResponse,
  createGroupChat,
  deleteGroup,
  fetchChats,
  removeFromGroup,
  renameGroupChat,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChats);
router.route("/group").post(authMiddleware, createGroupChat);
router.route("/rename").put(authMiddleware, renameGroupChat);
router.route("/groupadd").put(authMiddleware, addToGroup);
router.route("/groupremove").put(authMiddleware, removeFromGroup);
router.route("/groupdelete").delete(authMiddleware, deleteGroup);
router.route("/chatbot").post(chatBotResponse);

export default router;
