import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meetingId: {
    type: String,
    unique: true,
    required: true,
    default: () => `meeting-${Math.random().toString(36).substr(2, 9)}`, // Simple unique ID
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "cancelled"],
    default: "scheduled",
  },
}, { timestamps: true });

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;

