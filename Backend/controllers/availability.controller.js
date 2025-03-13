import Availability from "../models/availability.model.js";

export const addAvailability = async (req, res) => {
  const { startTime, endTime } = req.body;
  const lawyerId = req.user._id;

  try {
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "Start time must be before end time" });
    }
    if (new Date(startTime) < Date.now()) {
      return res.status(400).json({ error: "Cannot set availability in the past" });
    }

    const slot = new Availability({ lawyerId, startTime, endTime });
    await slot.save();
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    console.error("Error in addAvailability:", error);
    res.status(500).json({ error: "Failed to add availability", message: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  const { lawyerId } = req.params;

  try {
    const slots = await Availability.find({ lawyerId, status: "available" }).sort({ startTime: 1 });
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    res.status(500).json({ error: "Failed to fetch slots", message: error.message });
  }
};