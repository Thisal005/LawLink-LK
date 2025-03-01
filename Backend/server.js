import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";
import userRouter from "./routes/user.route.js";
import lawyerAuthRouter from "./routes/lawyerAuth.route.js";
import lawyerRouter from "./routes/lawyer.route.js";
import caseRouter from "./routes/case.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true })); 

// Static file directories
app.use("/uploads", express.static("uploads"));
app.use("/uploads-chat", express.static("uploads-chat"));

app.use("/api/auth/", authRoute);
app.use("/api/messages/", messageRoute);
app.use("/api/user/", userRouter);
app.use("/api/lawyer/", lawyerAuthRouter);
app.use("/api/lawyer-data/", lawyerRouter);
app.use("/api/case/", caseRouter);

app.listen(PORT, () => {
    connectTomongoDB();
    console.log(`Server running on port ${PORT}`);
});