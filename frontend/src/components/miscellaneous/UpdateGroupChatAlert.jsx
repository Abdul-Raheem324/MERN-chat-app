import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChatState } from "@/context/chatProvider";
import UserBadge from "../UserComponents/UserBadge";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UpdateGroupChatAlert({ children, fetchAgain, setFetchAgain }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupName, setGroupName] = useState(selectedChat?.chatName || "");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinLoading, setSpinLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
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

  useEffect(() => {
    handleSearch();
  }, [search]);

  const renameGroup = async () => {
    if (!groupName) {
      toast.error("Please provide Group Name to update");
      return;
    }

    try {
      setSpinLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        config
      );

      setSelectedChat(data);

      setSpinLoading(false);
      toast.success("Group name updated!");
      handleDialogClose();
    } catch (error) {
      console.log(error.message);
      setSpinLoading(false);
      toast.error("Error updating group name");
    }
  };

  const handleLeave = () => {
    deleteUser(user.user);
    handleDialogClose();
  };

  const addUserToGroup = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user?.user._id) {
      toast.error("Only group admin can add someone!");
      return;
    }
    try {
      setAddLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setAddLoading(false);
      toast.success("User added to group");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteUser = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== user?.user._id &&
      user1._id !== user?.user._id
    ) {
      toast.error("Only admin can remove members");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setAddLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  const deleteGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
      };

      const { data } = await axios.delete("/api/chat/groupdelete", {
        headers: config.headers,
        data: { chatId: selectedChat._id },
      });

      setSelectedChat(null);
      setFetchAgain(!fetchAgain);
      handleDialogClose();
      toast.success("Group deleted successfully!");
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Error deleting group");
    }
  };

  return (
    <div>
      <span onClick={handleDialogOpen}>{children}</span>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-[#333a42] border-black max-w-[600px] mx-auto rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-gray-200 text-xl sm:text-3xl mb-2">
              {selectedChat?.chatName?.toUpperCase() || "Group Chat"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription></AlertDialogDescription>
          <div className="w-full flex flex-col gap-2">
            <h1 className="text-lg text-gray-200 text-center">
              Group Members:
            </h1>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedChat?.users?.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => deleteUser(user)}
                  isAdmin={selectedChat.groupAdmin._id === user._id}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-center mt-0 sm:mt-4">
            <input
              type="text"
              placeholder="Update Group Chat Name"
              className="w-3/5 p-2 sm:text-lg text-sm bg-[#2d343b] text-white rounded-lg border border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 shadow-lg placeholder-gray-400"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              className="rounded-md px-2 py-2 bg-green-600 hover:bg-green-800 text-white transition"
              onClick={renameGroup}
            >
              {spinLoading ? <ClipLoader /> : "Update Name"}
            </button>
          </div>

          <div className="flex flex-col items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Search and Add Users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-3/4 p-2 text-lg bg-[#2d343b] text-white rounded-lg border border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 shadow-lg placeholder-gray-400"
            />
            <div className="w-full flex flex-wrap gap-2 justify-center">
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
              searchResult.slice(0, 3).map((user) => (
                <div
                  key={user._id}
                  className="w-full bg-gray-600 hover:bg-gray-700 cursor-pointer h-18 p-2 rounded-xl flex items-center gap-2 text-gray-200"
                  onClick={() => addUserToGroup(user)}
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
              <div className="text-gray-500 text-center">No users found</div>
            )}
          </div>

          <div className="text-center mt-4">
            <button>{addLoading ? <ClipLoader /> : ""}</button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-600 hover:bg-red-700 hover:text-white"
              onClick={handleLeave}
            >
              Leave Group
            </AlertDialogCancel>
            {selectedChat.groupAdmin._id === user?.user?._id ? (
              <AlertDialogCancel
                className="bg-gray-700 hover:bg-red-700 hover:text-white"
                onClick={deleteGroup}
              >
                <FontAwesomeIcon icon={faTrash} />
              </AlertDialogCancel>
            ) : (
              ""
            )}
            <AlertDialogCancel
              className="bg-gray-700 hover:bg-black hover:text-white"
              onClick={handleDialogClose}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UpdateGroupChatAlert;
