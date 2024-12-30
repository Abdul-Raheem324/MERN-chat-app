import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ChatBotMessages({ messages }) {
  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-col h-full">
        {messages &&
          messages.map((m, i) => {
            const isMyMessage = m.isUser;

            return (
              <div
                key={i}
                className={`flex items-center my-1 ${
                  isMyMessage ? "justify-end" : ""
                }`}
              >
                {!isMyMessage && (
                  <div className="flex-shrink-0 mr-2">
                    <FontAwesomeIcon
                      icon={faRobot}
                      size="lg"
                      style={{ color: "#74C0FC" }}
                    />
                  </div>
                )}

                <span
                  className={`relative max-w-xs p-4 ${
                    isMyMessage
                      ? "bg-gradient-to-r from-[#327475] to-[#3d5a5a] rounded-[15px_0px_15px_15px] ml-2"
                      : "bg-gradient-to-r from-[#264350] to-[#3b5f6d] rounded-[0px_15px_15px_15px] mr-2"
                  } shadow-md text-white font-medium hover:scale-105 transition-all duration-300 ease-in-out`}
                >
                  {m.text}

                  <span
                    className={`absolute ${
                      isMyMessage ? "right-2" : "left-2"
                    } bottom-0 w-0 h-0 border-t-8 border-l-8 border-transparent ${
                      isMyMessage ? "border-r-[#327475]" : "border-r-[#264350]"
                    }`}
                  ></span>
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ChatBotMessages;
