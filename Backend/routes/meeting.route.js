import express from "express";
import { scheduleMeeting, getMeetings, joinMeeting, endMeeting } from "../controllers/meeting.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/schedule", protectRoute, scheduleMeeting);
router.get("/", protectRoute, getMeetings);
router.get("/join/:meetingId", protectRoute, joinMeeting);
router.post("/end/:meetingId", protectRoute, endMeeting);

export default router;