import express from "express";
import connectDB from "./db/dbconfig.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || " http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ----------------------------Deployment----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname1 = path.dirname(__filename);
console.log("APP_ENV:", process.env.APP_ENV);
if (process.env.APP_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "..", "frontend", "dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
// ----------------------------Deployment----------------------------

const io = new SocketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin:
      process.env.APP_ENV === "production"
        ? process.env.APP_URL
        : "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (user) => {
    socket.join(user?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new msg", (newMsgReceived) => {
    let chat = newMsgReceived.chat;
    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id === newMsgReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMsgReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
