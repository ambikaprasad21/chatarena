const express = require("express");
const http = require("http");
const path = require("path");

const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);
const {
  addUser,
  getCurrentUser,
  disconnectUser,
  getRoomUsers,
} = require("./utils/users");
const { formatMessage } = require("./utils/message");

//express.static is used to serve static files from public folder. index.html file is served for root path (/)
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatArena";

io.on("connection", (socket) => {
  socket.on("letMeJoin", ({ username, room }) => {
    // console.log(username);
    const user = addUser(socket.id, username, room);

    socket.join(user.room);

    socket.broadcast
      .to(user?.room)
      .emit("message", formatMessage(botName, `${user.username} joined`));

    socket.emit("message", formatMessage(botName, "Welcome to the ChatArena"));

    io.to(user?.room).emit("userList", {
      room: user?.room,
      users: getRoomUsers(user?.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user?.room).emit("message", formatMessage(user.username, msg));
  });

  //when user disconnect remove it from users list
  socket.on("disconnect", () => {
    const user = disconnectUser(socket.id);

    // Sent the user list in the frontend

    io.to(user?.room).emit("userList", {
      room: user?.room,
      users: getRoomUsers(user?.room),
    });
    io.to(user?.room).emit(
      "message",
      formatMessage(botName, `${user?.username} has left the ChatArena`)
    );
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
