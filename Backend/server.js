import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { WebSocketServer } from "ws";
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
import sodium from "libsodium-wrappers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/uploads", express.static("uploads"));
app.use("/uploads-chat", express.static("uploads-chat"));

// Routes
app.use("/api/auth/", authRoute);
app.use("/api/messages/", messageRoute);
app.use("/api/user/", userRouter);
app.use("/api/lawyer/", lawyerAuthRouter);
app.use("/api/lawyer-data/", lawyerRouter);
app.use("/api/case/", caseRouter);
app.use("/api/tasks/", taskRouter);
app.use("/api/notifications/", notificationRouter);
app.use("/api/notes/", noteRouter);
app.use("/api/todos/", todoRouter);

// Error handling middleware
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

// WebSocket setup
const wss = new WebSocketServer({ server });

// Make clients Map global
global.clients = new Map();

wss.on("connection", async (ws, req) => {
  try {
    await sodium.ready;

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === "register") {
          global.clients.set(data.userId, ws);
          ws.userId = data.userId;
          return;
        }

        if (data.type === "message") {
          const recipientWs = global.clients.get(data.receiverId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(
              JSON.stringify({
                type: "message",
                message: data.message,
              })
            );
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      if (ws.userId) {
        global.clients.delete(ws.userId);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  } catch (error) {
    console.error("WebSocket connection error:", error);
    ws.close();
  }
});