import Meeting from "../models/meeting.model.js";
import Case from "../models/case.model.js";
import Lawyer from "../models/lawyer.model.js";
import User from "../models/user.model.js";

// Schedule a meeting
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

    const meeting = new Meeting({
      caseId,
      lawyerId,
      clientId,
      scheduledAt: scheduledTime,
    });

    await meeting.save();

    // Notify both lawyer and client
    const lawyerWs = global.clients.get(lawyerId.toString());
    const clientWs = global.clients.get(clientId.toString());

    const notificationPayload = {
      type: "newMeeting",
      meeting: {
        _id: meeting._id,
        caseId,
        scheduledAt,
        meetingId: meeting.meetingId,
        caseTitle: caseData.title,
      },
    };

    if (lawyerWs && lawyerWs.readyState === WebSocket.OPEN) {
      lawyerWs.send(JSON.stringify(notificationPayload));
    }
    if (clientWs && clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify(notificationPayload));
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

// Join a meeting
export const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findOne({ meetingId })
      .populate("caseId", "title");

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    const isLawyer = meeting.lawyerId.toString() === userId.toString();
    const isClient = meeting.clientId.toString() === userId.toString();

    if (!isLawyer && !isClient) {
      return res.status(403).json({ error: "Unauthorized to join this meeting" });
    }

    const now = new Date();
    const scheduledAt = new Date(meeting.scheduledAt);
    const timeDifference = (scheduledAt - now) / (1000 * 60); // in minutes

    /*if (timeDifference > 5) { // Allow joining 5 minutes early
      return res.status(400).json({ error: "Meeting has not yet started" });
    }*/

    if (meeting.status === "completed" || meeting.status === "cancelled") {
      return res.status(400).json({ error: `Meeting is already ${meeting.status}` });
    }

    if (meeting.status === "scheduled") {
      meeting.status = "ongoing";
      await meeting.save();
    }

    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    console.error("Error in joinMeeting:", error);
    res.status(500).json({ error: "Failed to join meeting", message: error.message });
  }
};

// End a meeting
export const endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    const isLawyer = meeting.lawyerId.toString() === userId.toString();
    const isClient = meeting.clientId.toString() === userId.toString();

    if (!isLawyer && !isClient) {
      return res.status(403).json({ error: "Unauthorized to end this meeting" });
    }

    meeting.status = "completed";
    await meeting.save();

    res.status(200).json({ success: true, message: "Meeting ended" });
  } catch (error) {
    console.error("Error in endMeeting:", error);
    res.status(500).json({ error: "Failed to end meeting", message: error.message });
  }
};