const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const formatMessage = require("./utils/messages");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const privateMessages = [];


app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage("Admin", "Welcome to the chat!"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Admin", `${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  socket.on("typing", (isTyping) => {
    const user = getCurrentUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit("typing", { userId: user.id, isTyping });
  });

  socket.on("sendPrivateMessage", ({ recipient, message }) => {
    const user = getCurrentUser(socket.id);
  
    if (!user) {
      return;
    }
  
    const recipientUser = getUserByUsername(recipient);
  
    if (!recipientUser) {
      return;
    }
  
    const formattedMessage = formatMessage(user.username, message);
    privateMessages.push({
      senderId: user.id,
      recipientId: recipientUser.id,
      message: formattedMessage,
    });
    io.to(recipientUser.socketId).emit("privateMessage", formattedMessage);
  });

  socket.on("getPrivateMessages", () => {
    // Retrieve the private messages history and emit it back to the client
    const messages = getPrivateMessagesForUser(socket.id);
    socket.emit("privateMessages", messages);
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Admin", `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  function getSocketIdByUsername(username) {
    const user = users.find((user) => user.username === username);
    return user ? user.id : null;
  }

  function getPrivateMessagesForUser(userId) {
    return privateMessages.filter(
      (msg) => msg.senderId === userId || msg.recipientId === userId
    );
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
