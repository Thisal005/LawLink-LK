import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cookieParser());


const allowedOrigins = ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true })); 


app.use("/api/auth/", authRoute);
app.use("/api/messages/", messageRoute);
app.use("/api/user/", userRouter)


app.listen(PORT, () => {
    connectTomongoDB();
    console.log(`Server running on port ${PORT}`);
});
