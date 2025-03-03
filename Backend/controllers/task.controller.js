// controllers/taskController.js
import Task from "../models/tasks.model.js";
import Case from "../models/case.model.js";
import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";

// Assign a new task (Lawyer only)
export const createTask = async (req, res) => {
  try {
    const { taskName, description, clientId, caseId } = req.body;
    const lawyerId = req.user._id;

    // Validate case and client
    const caseExists = await Case.findById(caseId);
    const clientExists = await User.findById(clientId);

    if (!caseExists || !clientExists) {
      return res.status(404).json({ msg: "Case or client not found" });
    }

    // Create a new task
    const newTask = new Task({
      taskName,
      description,
      clientId,
      lawyerId,
      caseId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error in createTask controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get task details by ID
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("clientId", "fullName email")
      .populate("lawyerId", "fullName email")
      .populate("caseId", "caseName");

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Error in getTask controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update task status (Client only)
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Ensure only the assigned client can update the task
    if (task.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error("Error in updateTaskStatus controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};