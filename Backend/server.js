import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
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
import meetingRouter from "./routes/meeting.route.js";
import availabilityRouter from "./routes/availability.route.js";
import Meeting from "./models/meeting.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use("/uploads", express.static("uploads"));
app.use("/uploads-chat", express.static("uploads-chat"));

// Routes
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
app.use("/api/meetings", meetingRouter);
app.use("/api/availability", availabilityRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// Create HTTP Server
const server = http.createServer(app);

// Start Server
server.listen(PORT, () => {
  connectTomongoDB()
    .then(() => console.log(`Server running on port ${PORT}`))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));
});

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Store connected clients
global.clients = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Validate userId
  if (!userId) {
    socket.disconnect();
    console.warn("No userId provided, disconnected socket");
    return;
  }

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
  global.clients.set(userId, socket);
  socket.userId = userId;

  // Chat Message Handling
  socket.on("newMessage", (message) => {
    const recipientSocket = global.clients.get(message.receiverId);
    if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
      console.log(`Forwarding message from ${userId} to ${message.receiverId}`);
      recipientSocket.emit("newMessage", message);
    } else {
      console.log(`Recipient ${message.receiverId} not connected`);
    }
  });

  // Video Call Signaling
  socket.on("join-meeting", async (meetingId) => {
    try {
      const meeting = await Meeting.findOne({ meetingId });
      if (!meeting) {
        socket.emit("error", "Meeting not found");
        return;
      }
      if (meeting.clientId.toString() !== userId && meeting.lawyerId.toString() !== userId) {
        socket.emit("error", "Unauthorized to join this meeting");
        return;
      }
      if (meeting.status !== "scheduled" && meeting.status !== "ongoing") {
        socket.emit("error", "Meeting is not active");
        return;
      }

      socket.join(meetingId);
      console.log(`${userId} joined meeting: ${meetingId}`);
      socket.to(meetingId).emit("user-joined", userId);
    } catch (error) {
      console.error(`Error joining meeting ${meetingId}:`, error);
      socket.emit("error", "Failed to join meeting");
    }
  });

  socket.on("offer", ({ offer, meetingId }) => {
    console.log(`Received offer from ${userId} for meeting: ${meetingId}`);
    socket.to(meetingId).emit("offer", { offer, from: userId });
  });

  socket.on("answer", ({ answer, meetingId }) => {
    console.log(`Received answer from ${userId} for meeting: ${meetingId}`);
    socket.to(meetingId).emit("answer", { answer, from: userId });
  });

  socket.on("ice-candidate", ({ candidate, meetingId }) => {
    console.log(`Received ICE candidate from ${userId} for meeting: ${meetingId}`);
    socket.to(meetingId).emit("ice-candidate", { candidate, from: userId });
  });

  socket.on("leave-meeting", (meetingId) => {
    console.log(`${userId} left meeting: ${meetingId}`);
    socket.to(meetingId).emit("user-left", userId);
    socket.leave(meetingId);
  });

  // Handle Disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${userId}. Reason: ${reason}`);
    if (userId) {
      global.clients.delete(userId);
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("user-left", userId);
        }
      });
    }
  });

  // Error Handling for Socket
  socket.on("error", (err) => {
    console.error(`Socket error for user ${userId}:`, err);
    socket.emit("error", "An error occurred on the server");
  });
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("HTTP server closed");
    io.close(() => {
      console.log("WebSocket server closed");
      process.exit(0);
    });
  });
});