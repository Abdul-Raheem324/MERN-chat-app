import axios from "axios";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "UserId not provided" });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMsg");

  isChat = await User.populate(isChat, {
    path: "latestMsg.sender",
    select: "username avatar email",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    const chatData = {
      isGroupChat: false,
      chatName: "sender",
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return res.status(200).send(fullChat);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMsg")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    if (!chats) {
      return res.status(404).json({ message: "No chats found for this user." });
    }

    const populatedChats = await User.populate(chats, {
      path: "latestMsg.sender",
      select: "username avatar email",
    });

    res.status(200).send(populatedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch chats. Please try again later." });
  }
};

export const createGroupChat = async (req, res) => {
  try {
    let users = JSON.parse(req.body.users);
    let chatName = req.body.chatName;
    if (!users || !chatName) {
      return res.status(400).json({ message: "Please fill all the details" });
    }
    if (users.length < 2) {
      return res.status(401).json({
        message: "Group chat can't be created with less than two users",
      });
    }
    users.push(req.user);
    const groupChat = await Chat.create({
      users,
      chatName,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const renameGroupChat = async (req, res) => {
  try {
    let { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
      return res
        .status(400)
        .json({ message: "Chat ID and chat name are required." });
    }
    const updatedChatName = await Chat.findOneAndUpdate(
      { _id: chatId },
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChatName) {
      res.status(400).json({ message: "Chat not found" });
    }

    res.status(200).send(updatedChatName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToGroup = async (req, res) => {
  try {
    let { chatId, userId } = req.body;
    if ((!chatId, !userId)) {
      res.status(400).json({ message: "Please fill details to add" });
    }
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
      res.status(400).json({ message: "Chat not found to add user" });
    }

    res.status(200).send(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromGroup = async (req, res) => {
  try {
    let { chatId, userId } = req.body;
    if ((!chatId, !userId)) {
      return res
        .status(400)
        .json({ message: "Please fill details to remove user from group" });
    }
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
      return res.status(400).json({ message: "Chat not found to remove user" });
    }

    res.status(200).send(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    let { chatId } = req.body;
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat group not found" });
    }
    res.status(200).json("Group deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chatBotResponse = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill
`,

      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const botReply =
      response.data[0]?.generated_text || "I'm sorry, I couldn't process that.";
    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Error connecting to Hugging Face API:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch response from the AI model." });
  }
};
