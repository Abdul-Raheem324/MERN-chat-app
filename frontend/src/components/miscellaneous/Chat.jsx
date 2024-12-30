import React from "react";
import { ChatState } from "@/context/chatProvider";
import SingleChat from "../SingleChat";
import ChatBot from "./ChatBot";

function Chat({ fetchAgain, setFetchAgain }) {
  const { selectedChat, isAiChat } = ChatState();
  return (
    <div
      className={`rounded-3xl ${
        selectedChat || isAiChat ? "block" : "hidden sm:block sm:w-full"
      } ${selectedChat || isAiChat ? "w-full h-full" : ""}`}
      style={{
        height: "calc(100vh - 8rem)",
        background: "linear-gradient(135deg, #1e1f23, #202224)",
      }}
    >
      {isAiChat ? (
        <ChatBot />
      ) : (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </div>
  );
}

export default Chat;
