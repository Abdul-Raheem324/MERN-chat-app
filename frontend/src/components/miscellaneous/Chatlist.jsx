import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChatState } from "@/context/chatProvider";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import { getSenderAvatar, getSenderName } from "@/conifg/chatLogic";
import { Button } from "../ui/button";
import GroupChatAlert from "./GroupChatAlert";
import { toast } from "react-toastify";

function Chatlist({ fetchAgain }) {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    isAiChat,
  } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);

  const fetchChat = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.user?.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log("Error fetching chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser && storedUser.user) {
      setLoggedUser(storedUser.user);
    } else {
      console.error("No user information found in localStorage.");
    }
    fetchChat();
  }, [fetchAgain]);

  const safeChats = Array.isArray(chats) ? chats : [];

  if (!loggedUser) {
    return <ChatLoading />;
  }

  return (
    <div
      className={`w-full sm:w-1/3 p-4 mr-5 rounded-3xl ${
        selectedChat || isAiChat ? "hidden sm:block" : "block sm:block"
      } `}
      style={{
        background: "linear-gradient(135deg, #1e1f23, #202224)",
        height: "calc(100vh - 8rem)",
      }}
    >
      <div className="flex p-2 justify-between top-0 z-10">
        <h1 className="text-2xl font-extrabold">Chat</h1>
        <GroupChatAlert >
          <Button className="flex items-center gap-2 bg-[#333a42] rounded-lg hover:bg-gray-800 px-2">
            <h1>Group Chat</h1>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </GroupChatAlert>
      </div>

      <div
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-600 scrollbar-track-gray-700"
        style={{ maxHeight: "calc(100vh - 14rem)", paddingRight: "8px" }}
      >
        <div className="space-y-3">
          {loading ? (
            <div>
              <ChatLoading />
              <ChatLoading />
              <ChatLoading />
              <ChatLoading />
              <ChatLoading />
              <ChatLoading />
              <ChatLoading />
              <ChatLoading />
            </div>
          ) : safeChats.length > 0 ? (
            safeChats.map((chat) => (
              <div
                className={`flex gap-5 flex-nowrap overflow-hidden items-center p-2 bg-[#333a42] rounded-xl w-full h-20 hover:bg-[#3a5f75] cursor-pointer ${
                  selectedChat && selectedChat._id === chat._id
                    ? "bg-[#4b6c7f]"
                    : ""
                }`}
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="rounded-full flex-shrink-0">
                  <img
                    src={
                      !chat.isGroupChat
                        ? getSenderAvatar(loggedUser, chat.users)
                        : chat.groupAvatar
                    }
                    alt=""
                    className="w-16 h-16 object-center rounded-full"
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <h1 className="text-xl  text-white overflow-hidden text-ellipsis whitespace-nowrap">
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                  </h1>
                  <p className="truncate text-sm text-gray-500">
                    <span>message</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No chats found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatlist;
