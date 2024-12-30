import { ChatState } from "@/context/chatProvider";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

function ChatMessages({ messages }) {
  const { user, selectedChat } = ChatState();

  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-col h-full">
        {messages &&
          messages.map((m, i) => {
            const isMyMessage = m.sender._id === user.user._id;

            return (
              <div
                key={m._id}
                className={`flex items-center my-1 ${
                  isMyMessage ? "justify-end" : ""
                }`}
              >
                {!isMyMessage &&
                  (selectedChat.isGroupChat ? (
                    <div className="flex-shrink-0 mr-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center text-white">
                            <img
                              src={m.sender.avatar}
                              className="w-10 h-10 rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
                              alt={m.sender.username}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="border w-auto p-1 rounded-lg bg-gray-700">
                            <p>{m.sender.username}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : null)}

                <span
                  className={`relative max-w-xs p-4 ${
                    isMyMessage
                      ? "bg-gradient-to-r from-[#327475] to-[#3d5a5a] rounded-[15px_0px_15px_15px] ml-2"
                      : "bg-gradient-to-r from-[#264350] to-[#3b5f6d] rounded-[0px_15px_15px_15px] mr-2"
                  } shadow-md text-white font-medium hover:scale-105 transition-all duration-300 ease-in-out`}
                >
                  {m.content}
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

export default ChatMessages;
