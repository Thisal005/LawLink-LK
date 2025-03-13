import Meeting from "../models/meeting.model.js";
import Case from "../models/case.model.js";
import Lawyer from "../models/lawyer.model.js";
import User from "../models/user.model.js";

// Schedule a meeting
export const scheduleMeeting = async (req, res) => {
  try {
    const { caseId, scheduledAt } = req.body;
    const clientId = req.user._id; // From protectRoute middleware

    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ error: "Case not found" });

    const lawyerId = caseData.lawyerId;
    if (!lawyerId) return res.status(400).json({ error: "No lawyer assigned to this case" });

    if (caseData.clientId.toString() !== clientId.toString()) {
      return res.status(403).json({ error: "Unauthorized to schedule for this case" });
    }

    const scheduledTime = new Date(scheduledAt);
    if (scheduledTime < Date.now()) {
      return res.status(400).json({ error: "Cannot schedule a meeting in the past" });
    }

    const meeting = new Meeting({
      caseId,
      lawyerId,
      clientId,
      scheduledAt: scheduledTime,
    });

    await meeting.save();

    // Notify lawyer via WebSocket (optional)
    const lawyerWs = global.clients.get(lawyerId.toString());
    if (lawyerWs && lawyerWs.readyState === WebSocket.OPEN) {
      lawyerWs.send(
        JSON.stringify({
          type: "newMeeting",
          meeting: {
            _id: meeting._id,
            caseId,
            scheduledAt,
            meetingId: meeting.meetingId,
          },
        })
      );
    }

    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    console.error("Error in scheduleMeeting:", error);
    res.status(500).json({ error: "Failed to schedule meeting", message: error.message });
  }
};

// Get scheduled meetings for the logged-in user
export const getMeetings = async (req, res) => {
  try {
    const userId = req.user._id;
    const isLawyer = await Lawyer.findById(userId);
    const filter = isLawyer ? { lawyerId: userId } : { clientId: userId };

    const meetings = await Meeting.find(filter)
      .populate("caseId", "title")
      .sort({ scheduledAt: 1 });

    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    console.error("Error in getMeetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings", message: error.message });
  }
};