import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // For parsing application/json
app.use(cookieParser());

// Configure allowed origins for CORS
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true })); // Use cors middleware

// Routes
app.use("/api/auth/", authRoute);
app.use("/api/messages/", messageRoute);

// Start the server
app.listen(PORT, () => {
    connectTomongoDB();
    console.log(`Server running on port ${PORT}`);
});
