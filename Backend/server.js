import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io"; // Replace ws with socket.io
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";
import userRouter from "./routes/user.route.js";
import lawyerAuthRouter from "./routes/lawyerAuth.route.js";
import lawyerRouter from "./routes/lawyer.route.js";
import caseRouter from "./routes/case.route.js";
import taskRouter from "./routes/tasks.route.js";
import notificationRouter from "./routes/notification.route.js";
import noteRouter from "./routes/note.route.js";
import todoRouter from "./routes/todo.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/uploads", express.static("uploads"));
app.use("/uploads-chat", express.static("uploads-chat"));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/user", userRouter);
app.use("/api/lawyer", lawyerAuthRouter);
app.use("/api/lawyer-data", lawyerRouter);
app.use("/api/case", caseRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/notes", noteRouter);
app.use("/api/todos", todoRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const server = app.listen(PORT, () => {
  connectTomongoDB();
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

global.clients = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user based on query param from frontend
  const userId = socket.handshake.query.userId;
  if (userId) {
    global.clients.set(userId, socket);
    socket.userId = userId;
  }

  // Existing message handling
  socket.on("message", (data) => {
    const recipientSocket = global.clients.get(data.receiverId);
    if (recipientSocket) {
      recipientSocket.emit("newMessage", data.message);
    }
  });

  // WebRTC signaling
  socket.on("join-meeting", (meetingId) => {
    socket.join(meetingId);
    socket.to(meetingId).emit("user-connected", userId); // Notify others in room
  });

  socket.on("offer", ({ offer, meetingId }) => {
    socket.to(meetingId).emit("offer", { offer, from: userId });
  });

  socket.on("answer", ({ answer, meetingId }) => {
    socket.to(meetingId).emit("answer", { answer, from: userId });
  });

  socket.on("ice-candidate", ({ candidate, meetingId }) => {
    socket.to(meetingId).emit("ice-candidate", { candidate, from: userId });
  });

  socket.on("disconnect", (meetingId) => {
    socket.to(meetingId).emit("user-disconnected", userId); // Notify others in room
    socket.leave(meetingId);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.userId) {
      global.clients.delete(socket.userId);
    }
  });

 
});