// routes/taskRoutes.js
import express from "express";
import {
  createTask,
  getTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import Task from "../models/tasks.model.js"; 

const taskRouter = express.Router();

// Assign a new task (Lawyer only)
taskRouter.post("/", protectRoute, createTask);

// Get task details by ID
taskRouter.get("/:id", protectRoute, getTask);

// Update task status (Client only)
taskRouter.put("/:id", protectRoute, updateTaskStatus);

// Get all tasks for a specific case (existing route)
taskRouter.get("/case/:caseId", protectRoute, async (req, res) => {
  try {
    const { caseId } = req.params;
    const tasks = await Task.find({ caseId })
      .populate("clientId", "fullName email")
      .populate("lawyerId", "fullName email")
      .populate("caseId", "caseName");
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by case:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// New route: Get tasks assigned by lawyer to a specific client and case
taskRouter.get("/assigned/:clientId/:caseId", protectRoute, async (req, res) => {
  try {
    const { clientId, caseId } = req.params;
    const lawyerId = req.user._id;

    const tasks = await Task.find({
      lawyerId,
      clientId,
      caseId,
    })
      .populate("clientId", "fullName email")
      .populate("lawyerId", "fullName email")
      .populate("caseId", "caseName")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching assigned tasks:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default taskRouter;