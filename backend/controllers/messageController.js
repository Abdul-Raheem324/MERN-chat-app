import Chat from "../models/chatModel.js";
import Msg from "../models/messgaeModel.js";
import User from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      res.status(400).json("Invalid credentials passed to the request");
    }
    let newMessage = {
      content: content,
      chat: chatId,
      sender: req.user._id,
    };
    let message = await Msg.create(newMessage);

    message = await message.populate("sender", "username avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMsg: message,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allMessages = async (req, res) => {
  try {
    const messages = await Msg.find({ chat: req.params.chatId })
      .populate("sender", "username avatar email")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
