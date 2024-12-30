import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faStar } from "@fortawesome/free-solid-svg-icons";

function UserBadge({ user, handleFunction, isAdmin }) {
  return (
    <div className="flex gap-3 w-36 bg-[#4b6c7f] sm:px-2 px-0  rounded-md justify-center items-center">
      {isAdmin && (
        <FontAwesomeIcon icon={faStar} fade style={{ color: "#bcd219" }} />
      )}
      <h1 className={`text-md text-gray-200 ${isAdmin ? "font-bold" : ""}`}>
        {user.username}
      </h1>

      {!isAdmin && (
        <FontAwesomeIcon
          onClick={handleFunction}
          className="cursor-pointer hover:text-red-700 text-black"
          icon={faXmark}
        />
      )}
    </div>
  );
}

export default UserBadge;
