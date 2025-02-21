import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http"; // Import createServer
import { Server } from "socket.io"; // Import Server from socket.io
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";
import userRouter from "./routes/user.route.js";
import lawyerAuthRouter from "./routes/lawyerAuth.route.js";
import lawyerRouter from "./routes/lawyer.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
app.use("/api/auth/", authRoute);
app.use("/api/messages/", messageRoute);
app.use("/api/user/", userRouter);
app.use("/api/lawyer/", lawyerAuthRouter);
app.use("/api/lawyer-data/", lawyerRouter);
app.use("/uploads", express.static("uploads"));

// Create an HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Allow connections from the frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for messages from the client
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

    // Broadcast the message to all clients
    io.emit("receiveMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Connect to MongoDB and start the server
connectTomongoDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});