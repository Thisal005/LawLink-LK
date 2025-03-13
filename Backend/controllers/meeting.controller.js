import Meeting from "../models/meeting.model.js";
import Case from "../models/case.model.js";
import Availability from "../models/availability.model.js";

export const scheduleMeeting = async (req, res) => {
  try {
    const { caseId, scheduledAt } = req.body;
    const clientId = req.user._id;

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

    const slot = await Availability.findOne({
      lawyerId,
      startTime: { $lte: scheduledTime },
      endTime: { $gte: scheduledTime },
      status: "available",
    });
    if (!slot) return res.status(400).json({ error: "Selected time slot is not available" });

    const meeting = new Meeting({ caseId, lawyerId, clientId, scheduledAt: scheduledTime });
    await meeting.save();

    slot.status = "booked";
    await slot.save();

    const lawyerWs = global.clients.get(lawyerId.toString());
    if (lawyerWs && lawyerWs.readyState === WebSocket.OPEN) {
      lawyerWs.send(JSON.stringify({ type: "newMeeting", meeting }));
    }

    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    console.error("Error in scheduleMeeting:", error);
    res.status(500).json({ error: "Failed to schedule meeting", message: error.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const userId = req.user._id;
    const isLawyer = req.user.role === "lawyer"; // Assuming role is added to user model
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

export const updateMeetingStatus = async (req, res) => {
  const { meetingId, status } = req.body;
  const userId = req.user._id;

  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    if (meeting.clientId.toString() !== userId.toString() && meeting.lawyerId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized to update this meeting" });
    }

    meeting.status = status;
    await meeting.save();
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    console.error("Error in updateMeetingStatus:", error);
    res.status(500).json({ error: "Failed to update status", message: error.message });
  }
};
