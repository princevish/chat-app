const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

const messageLimit = 5;
const messageTimeLimit = 5;
const messageCounts = new Map();
const CHAT_BOT = "ChatBot";
let allUsers = [];

io.on("connection", (socket) => {
  messageCounts.set(socket.id, 0);

  socket.on("join_room", (data) => {
    const { username, room } = data;
    socket.join(room);

    let __createdtime__ = Date.now();

    allUsers.push({ ...data, id: socket.id });

    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });
   socket.to(room).emit(
      "chatroom_users",
      allUsers.filter((user) => user.room === room)
    );
    socket.emit(
      "chatroom_users",
      allUsers.filter((user) => user.room === room)
    );

    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.on("send_message", (data) => {
      const messageCount = messageCounts.get(socket.id) || 0;
      const countDate = new Date();
      countDate.setMinutes(countDate.getMinutes() + messageTimeLimit);

      if (messageCount >= messageLimit) {
        if (Date.now() >= Date.parse(countDate)) {
          messageCounts.delete(socket.id);
        }
        socket.emit(
          "rateLimitExceeded",
          `You have reached the message limit. Please wait before to sending more messages.`
        );
        return;
      }

      messageCounts.set(socket.id, messageCount + 1);

      const { room } = data;
      io.in(room).emit("receive_message", data);
    });

    socket.on("leave_room", (data) => {
      const { username, room } = data;
      socket.leave(room);
      const __createdtime__ = Date.now();
      allUsers = allUsers.filter(
        (user) => user.username !== username && user.room !== socket.room
      );
      socket.to(room).emit("chatroom_users", allUsers);
      socket.to(room).emit("receive_message", {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
      });
    });
  });

  socket.on("disconnect", () => {
    messageCounts.delete(socket.id);
    const user = allUsers.find(
      (user) => user.id == socket.id
    );
    if (user?.username) {
      allUsers = allUsers.filter(
        (user) => user.id !== socket.id
      );
      socket.to(user.room).emit("chatroom_users", allUsers);
      socket.to(user.room).emit("receive_message", {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
