// routes/case.route.js
import express from "express";
import { createCase } from "../controllers/case.controller.js";
import Case from "../models/case.model.js";
import { protectRoute } from "../middleware/protectRoute.js";

const caseRouter = express.Router();

caseRouter.post("/create-case", createCase);

// Get case details by _id
caseRouter.get("/:caseId", protectRoute, async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId)
      .populate("clientId", "fullName email")
      .populate("lawyerId", "fullName email");


    if (!caseData) {
      return res.status(404).json({ msg: "Case not found" });
    }

    // Ensure the user is either the client or lawyer for this case
    if (
      caseData.clientId._id.toString() !== req.user._id.toString() &&
      caseData.lawyerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.status(200).json(caseData);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default caseRouter;