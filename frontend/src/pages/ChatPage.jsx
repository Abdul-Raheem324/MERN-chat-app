import React, { useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "@/context/chatProvider.jsx";
import Navbar from "@/components/miscellaneous/Navbar.jsx";
import Particles from "@/components/ui/particles";
import Chatlist from "@/components/miscellaneous/Chatlist.jsx";
import Chat from "@/components/miscellaneous/Chat.jsx";

function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black">
      <Particles
        color="#ffffff"
        quantity={400}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="w-full h-screen flex flex-col text-gray-200 p-5 relative chatlist-container">
        <div>
          {user && (
            <Navbar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
        <div className="flex h-full w-full chatlist-container">
          {user && <Chatlist fetchAgain={fetchAgain} />}
          {user && (
            <Chat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
