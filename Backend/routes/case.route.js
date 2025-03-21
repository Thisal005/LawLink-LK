// routes/case.route.js
import express from "express";
import Case from "../models/case.model.js";
import Notification from "../models/notifications.model.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createCase,
  getCaseDetails,
  getUserCases,
  getAllCases,
  sendOffer,
} from "../controllers/case.controller.js";
import mongoose from "mongoose";

const caseRouter = express.Router();

const sendResponse = (res, status, success, data, msg) => {
  res.status(status).json({ success, data, msg });
};

// Get all unassigned cases for lawyers
caseRouter.get("/all", protectRoute, getAllCases);

// Send offer for a case
caseRouter.post("/offer/:caseId", protectRoute, sendOffer);

// Create a new case
caseRouter.post("/create-case", protectRoute, createCase);

// Get case details (using controller from second file)
caseRouter.get("/:caseId", protectRoute, getCaseDetails);

// Get user's cases
caseRouter.get("/user/:userId", protectRoute, getUserCases);

// Get case participants (merged version with detailed response)
caseRouter.get("/:caseId/participants", protectRoute, async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return sendResponse(res, 400, false, null, "Invalid case ID");
    }

    const caseData = await Case.findById(caseId)
      .populate("clientId", "fullName email")
      .populate("lawyerId", "fullName email");

    if (!caseData) {
      return sendResponse(res, 404, false, null, "Case not found");
    }

    const isClient = caseData.clientId._id.toString() === req.user._id.toString();
    const isLawyer = caseData.lawyerId?._id.toString() === req.user._id.toString();

    if (!isClient && !isLawyer) {
      return sendResponse(res, 403, false, null, "Unauthorized");
    }

    const participants = {
      client: caseData.clientId
        ? { id: caseData.clientId._id, fullName: caseData.clientId.fullName, email: caseData.clientId.email }
        : null,
      lawyer: caseData.lawyerId
        ? { id: caseData.lawyerId._id, fullName: caseData.lawyerId.fullName, email: caseData.lawyerId.email }
        : null,
    };

    sendResponse(res, 200, true, participants, "Case participants retrieved successfully");
  } catch (error) {
    console.error("Error fetching case participants:", error);
    sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
});

// User notifications
caseRouter.get("/user/notifications", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const notifications = await Notification.find({ userId, userType: "User" })
      .sort({ createdAt: -1 })
      .limit(10);

    const message = notifications.length > 0
      ? "User notifications retrieved successfully"
      : "There are no notifications for you";
    sendResponse(res, 200, true, notifications || [], message);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
});

caseRouter.post("/user/notifications/mark-all-read", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const result = await Notification.updateMany(
      { userId, userType: "User", unread: true },
      { $set: { unread: false } }
    );

    const message = result.modifiedCount > 0
      ? "All user notifications marked as read"
      : "No unread notifications to mark as read";
    sendResponse(res, 200, true, null, message);
  } catch (error) {
    console.error("Error marking user notifications as read:", error);
    sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
});

// Lawyer notifications
caseRouter.get("/lawyer/notifications", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const notifications = await Notification.find({ userId, userType: "Lawyer" })
      .sort({ createdAt: -1 })
      .limit(10);

    const message = notifications.length > 0
      ? "Lawyer notifications retrieved successfully"
      : "There are no notifications for you";
    sendResponse(res, 200, true, notifications || [], message);
  } catch (error) {
    console.error("Error fetching lawyer notifications:", error);
    sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
});

caseRouter.post("/lawyer/notifications/mark-all-read", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const result = await Notification.updateMany(
      { userId, userType: "Lawyer", unread: true },
      { $set: { unread: false } }
    );

    const message = result.modifiedCount > 0
      ? "All lawyer notifications marked as read"
      : "No unread notifications to mark as read";
    sendResponse(res, 200, true, null, message);
  } catch (error) {
    console.error("Error marking lawyer notifications as read:", error);
    sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
});

export default caseRouter;