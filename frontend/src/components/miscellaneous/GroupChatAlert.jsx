import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChatState } from "@/context/chatProvider";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import UserBadge from "../UserComponents/UserBadge";
import ChatLoading from "../ChatLoading";

function GroupChatAlert({ children }) {
  const { user, chats, setChats } = ChatState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [grpChatName, setGrpChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSearchResult([]);
    setSearch("");
    setSelectedUsers([]);
  };

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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  const handleList = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added.");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const formData = {
    chatName: grpChatName,
    users: JSON.stringify(selectedUsers.map((u) => u._id)),
  };

  const createGroup = async () => {
    setLoadingSpin(true);

    if (!grpChatName || selectedUsers.length === 0) {
      toast.error("Please provide a group name and select users.");
      setLoadingSpin(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat/group", formData, config);

      setChats([data, ...chats]);

      toast.success("Group chat created");
      setLoadingSpin(false);
      handleDialogClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      console.error(errorMessage);
      setLoadingSpin(false);
    }
  };

  return (
    <div>
      <span onClick={handleDialogOpen}>{children}</span>

      <AlertDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        className="w-1/2 sm:w-full"
      >
        <AlertDialogContent className="bg-[#333a42] border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-gray-200 text-3xl mb-4">
              Create Group Chat
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xl text-gray-200">
              <input
                type="text"
                placeholder="Group Chat Name"
                value={grpChatName}
                onChange={(e) => setGrpChatName(e.target.value)}
                className="w-3/4 p-2 text-lg bg-[#2d343b] text-white rounded-lg border border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 shadow-lg placeholder-gray-400"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Search and Add Users"
              value={search}
              onChange={handleInputChange}
              className="w-3/4 p-2 text-lg bg-[#2d343b] text-white rounded-lg border border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 shadow-lg placeholder-gray-400"
            />

            <div className="w-full flex gap-2 overflow-y-scroll">
              {selectedUsers.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </div>

            {loading ? (
              <ChatLoading />
            ) : searchResult?.length > 0 ? (
              searchResult?.slice(0, 3).map((user) => (
                <div
                  key={user._id}
                  className="w-full bg-gray-600 hover:bg-gray-700 cursor-pointer h-18 p-2 rounded-xl flex items-center gap-2 text-gray-200"
                  onClick={() => handleList(user)}
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatar}
                    alt={user.username}
                  />
                  <div className="flex flex-col w-full text-lg text-gray-200">
                    {user.username}
                    <div className="font-bold text-zinc-900">
                      Email: {user.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No users found</div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-700 hover:bg-black hover:text-white"
              onClick={handleDialogClose}
            >
              Close
            </AlertDialogCancel>

            {loadingSpin ? (
              <ClipLoader color="white" />
            ) : (
              <AlertDialogAction
                className="bg-gray-700 hover:bg-blue-500 text-black hover:text-white"
                onClick={createGroup}
              >
                <h1>Create Chat</h1>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GroupChatAlert;
