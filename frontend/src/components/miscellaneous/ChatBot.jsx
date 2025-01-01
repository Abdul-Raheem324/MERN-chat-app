import { ChatState } from "@/context/chatProvider";
import {
  faFaceSmile,
  faPaperPlane,
  faArrowLeft,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { BeatLoader, ClipLoader } from "react-spinners";
import axios from "axios";
import ChatBotMessages from "./ChatBotMessages";

function ChatBot() {
  const { isAiChat, setIsAiChat } = ChatState();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeLoading, setTypeLoading] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setTypeLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.API_KEY}`,
        },
      };
      const response = await axios.post(
        "/api/chat/chatbot",
        {
          message: userMessage,
        },
        config
      );

      setMessages([
        ...messages,
        { text: userMessage, isUser: true },
        { text: response.data.reply, isUser: false },
      ]);
      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...messages,
        { text: "Error communicating with the bot.", isUser: false },
      ]);
    } finally {
      setTypeLoading(false);
    }
  };
  const onEmojiClick = (emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
      setShowPicker(false);
    }
  };

  const handleBackClick = () => {
    setIsAiChat(!isAiChat);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
      setUserMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div>
      <div
        className="flex flex-col h-full"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        <div
          className="bg-gray-700 w-full p-2 rounded-tl-3xl flex justify-between items-center rounded-tr-3xl"
          style={{ background: "linear-gradient(135deg, #181a1d, #1c1d1f)" }}
        >
          <div
            className="p-1 bg-slate-800 rounded-md hover:bg-gray-900 cursor-pointer"
            onClick={handleBackClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <h1 className="text-2xl ml-2 w-full text-center font-bold">
            QualityConnect AI
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-[#26282a] w-full scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-600 scrollbar-track-gray-700 mr-2">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <ClipLoader color="gray" size={50} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <ChatBotMessages messages={messages} />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="w-full flex flex-col  gap-2 p-3 bg-[#26282a] ">
          {typeLoading && (
            <div className="flex ml-4 mb-4">
              <BeatLoader color="#3b5f6d" speedMultiplier={0.6} />
            </div>
          )}
          <div className="flex gap-2">
            <div className="flex w-full items-center border border-gray-500 rounded-2xl bg-[#333a42] px-2 relative focus:ring-2 focus:ring-blue-600">
              <button
                onClick={() => setShowPicker((prevState) => !prevState)}
                className="cursor-pointer"
              >
                {showPicker ? (
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="hover:text-red-500"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    color="darkgray"
                    className="hover:text-yellow-300"
                  />
                )}
              </button>

              {showPicker && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <input
                type="text"
                value={userMessage}
                placeholder="Message"
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full border-none p-2 text-lg bg-transparent outline-none"
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              className="flex items-center bg-blue-500 gap-1 px-4 py-2 cursor-pointer text-gray-800 font-semibold tracking-widest rounded-md hover:bg-blue-400 duration-300 hover:gap-2"
              onClick={sendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
