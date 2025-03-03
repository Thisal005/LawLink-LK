// routes/taskRoutes.js
import express from "express";
import {
  createTask,
  getTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const taskRouter = express.Router();

// Assign a new task (Lawyer only)
taskRouter.post("/", protectRoute, createTask);

// Get task details by ID
taskRouter.get("/:id", protectRoute, getTask);

// Update task status (Client only)
taskRouter.put("/:id", protectRoute, updateTaskStatus);

export default taskRouter;