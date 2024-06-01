"strict mode";

const users = [];

//add new user to users array
const addUser = (id, username, room) => {
  const user = { id, username, room }; //creating user object from data
  users.push(user);
  return user;
};

//find user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//remove user from list when disconnect
const disconnectUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//users of particular room
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, getCurrentUser, disconnectUser, getRoomUsers };
