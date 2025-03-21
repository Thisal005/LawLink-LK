// models/case.model.js
import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    default: null,
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  caseType: {
    type: String,
    required: [true, "Case type is required"],
    enum: ["criminal", "civil", "family"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
    enum: ["colombo", "gampaha", "kandy"],
  },
  courtDate: {
    type: Date,
    required: [true, "Court date is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "ongoing", "completed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from creation
  },
});

const Case = mongoose.model("Case", caseSchema);

export default Case;