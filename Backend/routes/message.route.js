import express from "express";
import { sendMessage, getMessages, uploadFile, downloadFile } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import multer from "multer";
import { get } from "mongoose";


const router = express.Router();
const upload = multer({dest: 'uploads-chat/'});

router.get("/:id", protectRoute ,getMessages);
router.post("/send/:id", protectRoute ,sendMessage);
router.post("/upload/:id", protectRoute ,upload.single('file'), uploadFile);
router.get("/download/:messageId", protectRoute ,downloadFile);

export default router;
