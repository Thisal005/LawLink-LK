import express from "express";
import { scheduleMeeting, getMeetings } from "../controllers/meeting.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/schedule", protectRoute, scheduleMeeting);
router.get("/", protectRoute, getMeetings);

export default router;