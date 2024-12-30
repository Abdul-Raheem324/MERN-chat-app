import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChatLoading from "../ChatLoading";
import UserList from "../UserComponents/UserList";
import { ChatState } from "@/context/chatProvider";
import { ClipLoader } from "react-spinners";

export default function SideDrawer({
  isOpen,
  onClose,
  fetchAgain,
  setFetchAgain,
}) {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSearch = async () => {
    if (search.trim() === "") {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      let { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen && search.trim() !== "") {
      handleSearch();
    } else if (!isOpen) {
      setSearchResult([]);
      setSearch("");
      setLoading(false);
    }
  }, [isOpen, search]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((chat) => chat._id == data._id))
        setChats({ data, ...chats });
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error.message);
      setLoadingChat(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-opacity-50 z-10 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-[325px] bg-[#333a42] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-600 scrollbar-track-gray-700 p-5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full "
        }`}
        style={{
          background: "linear-gradient(135deg, #181a1d, #1c1d1f)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white text-2xl text-center font-bold">
          Search Users
        </h3>
        <div className="border border-[#1f233e] w-full  justify-between cursor-pointer mt-4 bg-[#333a42] hover:bg-[#3a434a] flex items-center px-2 rounded-lg">
          <input
            type="text"
            placeholder="Search User"
            value={search}
            onChange={handleInputChange}
            className="border-none p-2 text-sm bg-transparent outline-none"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-zinc-500 w-auto "
          />
        </div>
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
        ) : (
          searchResult?.map((user) => {
            return (
              <UserList
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            );
          })
        )}
        {loadingChat && <ClipLoader color="#000080" />}
      </div>
    </div>
  );
}
