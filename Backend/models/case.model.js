// models/case.model.js
import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseName: { type: String, required: true },
  caseType: { type: String, required: true },
  status: {
    type: String,
    enum: ["ongoing", "pending", "closed"], 
    default: "ongoing",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer", 
    required: true,
  },
  caseId: { type: String, unique: true, required: true }, 
  nextCourtDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Case = mongoose.model("Case", caseSchema);

export default Case;