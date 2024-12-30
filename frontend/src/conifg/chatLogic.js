export const getSenderName = (loggedUser, users) => {
  const otherUser = users?.find((user) => user._id !== loggedUser._id);
  return otherUser?.username;
};

export const getSenderEmail = (loggedUser, users) => {
  const otherUser = users?.find((user) => user._id !== loggedUser._id);
  return otherUser?.email;
};

export const getSenderAvatar = (loggedUser, users) => {
  const otherUser = users?.find((user) => user._id !== loggedUser._id);
  return otherUser?.avatar;
};
export const getSenderId = (loggedUser, users) => {
  const otherUser = users?.find((user) => user._id !== loggedUser._id);
  return otherUser?._id;
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
