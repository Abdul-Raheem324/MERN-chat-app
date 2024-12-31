import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faPaperPlane,
  faArrowLeft,
  faXmark,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { ChatState } from "@/context/chatProvider";
import {
  getSenderAvatar,
  getSenderEmail,
  getSenderId,
  getSenderName,
} from "@/conifg/chatLogic";
import { BeatLoader, ClipLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateGroupChatAlert from "./miscellaneous/UpdateGroupChatAlert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ChatMessages from "./miscellaneous/ChatMessages.jsx";
import { io } from "socket.io-client";

const ENDPOINT = "https://qualityconnect.onrender.com";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const onEmojiClick = (emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
      setShowPicker(false);
    }
  };

  const handleBackClick = () => {
    setSelectedChat(null);
    setIsDialogOpen(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (user.user._id === getSenderId(user.user, selectedChat.users)) {
      if (typing) {
        setTyping(false);
      }
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    let lastTyping = new Date().getTime();
    let length = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTyping;

      if (timeDiff >= length && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, length);
  };

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage.trim() !== "") {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new msg", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to send message.");
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
    setNewMessage("");
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message received", (newMsgReceived) => {
      if (
        !newMsgReceived ||
        selectedChatCompare?._id !== newMsgReceived.chat?._id
      ) {
        if (!notification.includes(newMsgReceived)) {
          setNotification([newMsgReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMsgReceived]);
      }
    });
  });
  return (
    <div className="relative h-full flex flex-col">
      {selectedChat ? (
        <div className="flex flex-col h-full">
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
            <h1 className="sm:text-2xl text:xl ml-2 w-full text-center font-bold">
              {!selectedChat.isGroupChat
                ? getSenderName(user.user, selectedChat?.users)
                : selectedChat.chatName.toUpperCase()}
            </h1>
            <div className="border border-gray-900 hover:bg-gray-800 cursor-pointer">
              {!selectedChat.isGroupChat ? (
                <div>
                  <FontAwesomeIcon icon={faEye} onClick={handleDialogOpen} />
                  <AlertDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <AlertDialogContent className="bg-[#333a42] border-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-gray-200 text-3xlmb-2">
                          {getSenderName(user.user, selectedChat?.users)}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="justify-center flex flex-col items-center gap-5 text-xl text-gray-200">
                          <img
                            className="w-24 h-24 rounded-full"
                            src={getSenderAvatar(
                              user.user,
                              selectedChat?.users
                            )}
                            alt="profile"
                          />
                          <span>
                            Email :{" "}
                            {getSenderEmail(user.user, selectedChat.users)}
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="bg-bgray-700 hover:bg-black hover:text-white"
                          onClick={handleDialogClose}
                        >
                          Close
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <UpdateGroupChatAlert
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                >
                  <FontAwesomeIcon icon={faEye} />
                </UpdateGroupChatAlert>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-[#26282a] w-full scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-600 scrollbar-track-gray-700 mr-2">
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <ClipLoader color="gray" size={50} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-y-auto">
                <ChatMessages messages={messages} />
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="w-full flex flex-col  gap-2 p-3 bg-[#26282a] ">
            {isTyping && (
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
                  value={newMessage}
                  placeholder="Message"
                  onChange={handleTyping}
                  onKeyDown={sendMessage}
                  className="w-full border-none p-2 text-lg bg-transparent outline-none"
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
      ) : (
        <div
          className="w-full flex justify-center items-center"
          style={{ height: "calc(100vh - 10rem)" }}
        >
          <h1 className="lg:text-3xl text-2xl font-semibold">
            Select a user to start chatting
          </h1>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
