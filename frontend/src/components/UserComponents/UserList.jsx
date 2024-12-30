import React from "react";

function UserList({ user, handleFunction }) {
  return (
    <div>
      <div
        className="mt-3 w-full bg-gray-700 hover:bg-gray-800 cursor-pointer h-18 p-1 rounded-lg flex items-center gap-2 overflow-hidden"
        onClick={handleFunction}
      >
        <img className="h-12 w-12 rounded-full" src={user.avatar} alt="" />
        <div className="flex flex-col w-full">
          <h1 className="text-lg">{user.username}</h1>
          <h1 className="text-lg">
            {" "}
            <span className="font-extrabold text-zinc-900">Email : </span>
            {user.email}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default UserList;
