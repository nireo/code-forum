interface SocketUser {
  id: string;
  socketId: string;
  username: string;
}

// users stored in memory since it would be stupid to
// store them in a place like a database
const users: SocketUser[] = [];

export const addUser = (
  socketId: string,
  id: string,
  username: string
): SocketUser | object => {
  const exists = users.find(u => u.socketId === socketId);

  // not really necessary, but just for good measure
  if (!id || !username) return { error: "Username is required" };
  if (exists) return { error: "User already exists in chat" };

  const user: SocketUser = {
    id,
    socketId,
    username
  };
  return user;
};

export const removeUser = (id: string): SocketUser | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

export const getUser = (id: string): SocketUser | undefined => {
  return users.find(user => user.socketId === id);
};

export const getUsersInChat = () => {
  return users;
};
