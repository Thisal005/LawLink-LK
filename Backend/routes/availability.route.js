import express from "express";
import { addAvailability, getAvailableSlots } from "../controllers/availability.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/add", protectRoute, addAvailability);
router.get("/:lawyerId", protectRoute, getAvailableSlots);

export default router;