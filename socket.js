import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

export const GetReceiverSocketId = (receiverId) => {
  return onlineUsers[receiverId];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (receiverId) => {
    onlineUsers[receiverId] = socket.id;
    console.log("User joined:", receiverId, "with socket ID:", socket.id);
  });
  socket.emit("onlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

export { server, io, app };
