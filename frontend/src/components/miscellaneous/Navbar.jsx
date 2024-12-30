import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faChevronDown,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatState } from "@/context/chatProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "react-toastify";
import SideDrawer from "./SideDrawer";
import { ClipLoader } from "react-spinners";
import { getSenderName } from "@/conifg/chatLogic";
import { Badge } from "@mui/material";

function Navbar({ fetchAgain, setFetchAgain }) {
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    isAiChat,
    setIsAiChat,
  } = ChatState();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialog2Open, setIsDialog2Open] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState();

  const logout = async () => {
    try {
      const res = await axios.post("/api/user/logout");
      localStorage.removeItem("token");
      toast.success(res.data.message);
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error.message);
      toast.error(error.res.data.message);
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen2 = () => {
    setIsDialog2Open(true);
  };

  const handleDialogClose2 = () => {
    setIsDialog2Open(false);
  };

  const handleSearchClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const editProfile = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/editprofile",
        {
          name: name,
        },
        config
      );
      setUser((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          username: name,
        },
      }));
      setLoading(false);

      toast.success("Username updated!");
      setName("");
      handleDialogClose2();
    } catch (error) {
      console.log(error.message);
      toast.error(
        error?.response?.data?.message || "Failed to update username"
      );
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full flex sm:flex-row justify-between p-2 mb-5 ${
        selectedChat ? "sm:flex hidden" : ""
      }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={`border border-[#1f233e] cursor-pointer bg-[#333a42] hover:bg-[#3a434a] flex items-center p-3 sm:p-0 sm:px-2 rounded-lg w-full sm:w-auto mb-2 `}
              onClick={handleSearchClick}
            >
              <input
                type="text"
                placeholder="Search User"
                className="border-none p-2 text-sm bg-transparent outline-none w-full hidden sm:block"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-zinc-500 ml-2 block sm:hidden"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search for the users</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <button
        className={`text-gray-200 flex items-center bg-[#333a42] sm:p-1 px-4 border border-[#21394b] rounded-md gap-2 hover:bg-[#3a434a] transition-transform transform hover:scale-105 shadow-lg  sm:mb-2 ${
          isAiChat || selectedChat ? "hidden sm:flex" : ""
        }`}
        onClick={() => setIsAiChat(!isAiChat)}
      >
        <FontAwesomeIcon
          icon={faRobot}
          style={{ color: "#74C0FC" }}
          size="lg"
        />
        <span className="text-lg font-semibold hidden sm:block">
          QualityConnect AI
        </span>
      </button>

      <div
        className={`flex sm:flex items-center gap-5 sm:w-auto justify-between sm:justify-start`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger>
            {notification.length > 0 ? (
              <div>
                <Badge
                  badgeContent={notification.length}
                  color={notification.length > 0 ? "error" : "transparent"}
                  variant="dot"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  overlap="rectangular"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    shake
                    className="hover:text-[#333a42] cursor-pointer"
                    color="#8f93c2"
                    size="xl"
                  />
                </Badge>
              </div>
            ) : (
              <Badge
                badgeContent={notification.length}
                color={notification.length > 0 ? "error" : "transparent"}
                variant="dot"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                overlap="rectangular"
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="hover:text-[#333a42] cursor-pointer"
                  color="#8f93c2"
                  size="xl"
                />
              </Badge>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[#333a42] text-gray-200 focus:border-[black] mt-3">
            {notification.length > 0 ? (
              notification.map((notifi) => (
                <DropdownMenuItem
                  key={notifi._id}
                  onClick={() => {
                    setSelectedChat(notifi.chat);
                    setNotification(notification.filter((n) => n !== notifi));
                  }}
                >
                  {notifi.chat.isGroupChat
                    ? `New message in ${notifi.chat.chatName}`
                    : `New message from ${getSenderName(
                        user.user,
                        notifi.chat.users
                      )}`}
                </DropdownMenuItem>
              ))
            ) : (
              <h1>No new notifications</h1>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-[#333a42] hover:bg-[#3a434a] flex items-center gap-2 px-2 rounded-md h-12 cursor-pointer">
              <img
                src={user?.user?.avatar}
                className="border w-10 h-10 rounded-full"
                alt={user?.user?.username}
              />
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[#333a42] text-gray-200 focus:border-[black]">
            <DropdownMenuItem onClick={handleDialogOpen}>
              My Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>{user?.user?.email}</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDialogOpen2}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SideDrawer
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-[#333a42] border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-gray-200 text-3xl mb-2">
              {user?.user?.username}
            </AlertDialogTitle>
            <AlertDialogDescription className="justify-center flex flex-col items-center gap-5 text-xl text-gray-200">
              <img
                className="w-24 h-24 rounded-full"
                src={user?.user?.avatar}
                alt="profile"
              />
              <span>Email : {user?.user?.email}</span>
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

      <AlertDialog open={isDialog2Open} onOpenChange={setIsDialog2Open}>
        <AlertDialogContent className="bg-[#333a42] border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-gray-200 text-3xl mb-2">
              Edit Profile
            </AlertDialogTitle>
            <AlertDialogDescription className="justify-center flex flex-col items-center gap-5 text-xl text-gray-200">
              <input
                type="text"
                placeholder="Update username"
                className="w-3/5 p-2 text-lg bg-[#2d343b] text-white rounded-lg border border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 shadow-lg placeholder-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="rounded-md px-2 py-2 bg-blue-600 hover:bg-blue-800 text-white transition"
                onClick={editProfile}
              >
                {loading ? <ClipLoader size={30} /> : "Update username"}
              </button>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-bgray-700 hover:bg-black hover:text-white"
              onClick={handleDialogClose2}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Navbar;
