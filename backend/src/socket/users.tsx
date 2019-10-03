interface SocketUser {
  id: string;
  username: string;
}

// users stored in memory since it would be stupid to
// store them in a place like a database
const users: SocketUser[] = [];

const addUser = (id: string, username: string): SocketUser | object => {
  const exists = users.find(u => u.id === id);

  // not really necessary, but just for good measure
  if (!id || !username) return { error: "Username is required" };
  if (exists) return { error: "User already exists in chat" };

  const newUser: SocketUser = {
    id,
    username
  };
  return newUser;
};

const removeUser = (id: string): SocketUser | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id: string): SocketUser | undefined => {
  return users.find(user => user.id === id);
};

const getUsersInChat = () => {
  return users;
};

export default { addUser, removeUser, getUser, getUsersInChat };
