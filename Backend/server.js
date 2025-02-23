import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; // Changed from https to http
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";
import userRouter from "./routes/user.route.js";
import lawyerAuthRouter from "./routes/lawyerAuth.route.js";
import lawyerRouter from "./routes/lawyer.route.js";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

dotenv.config(); // Moved to the top

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per windowMs
    message: "Too many requests, please try again later.",
    statusCode: 429, // HTTP 429 Too Many Requests
});

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);
const io = new Server(server);

// Socket.io middleware
io.use((socket, next) => {
    const token = socket.handshake.query.token; // Get token from query
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decoded;
        next();
    });
});

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Apply rate limiter to /api routes
app.use("/api", limiter);

// Routes
app.use("/api/auth/", authRoute);
app.use("/api/messages/", messageRoute);
app.use("/api/user/", userRouter);
app.use("/api/lawyer/", lawyerAuthRouter);
app.use("/api/lawyer-data/", lawyerRouter);

// Static file serving with rate limiting
app.use("/uploads", express.static("uploads")); // Removed limiter from here

// Start server
server.listen(PORT, () => { // Changed to use server instead of app
    connectTomongoDB()
        .then(() => {
            console.log(`Server running on port ${PORT}`);
        })
        .catch(error => {
            console.error("Database connection failed:", error);
        });
});