import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const ScheduleMeeting = ({ caseId }) => {
  const { user } = useAuthContext();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching lawyer's available slots (replace with real API later)
    const mockSlots = [
      new Date(Date.now() + 5 + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after
    ];
    setAvailableSlots(mockSlots);
  }, [caseId]);

  const handleSchedule = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/meetings/schedule",
        { caseId, scheduledAt: selectedSlot },
        { withCredentials: true }
      );
      toast.success("Meeting scheduled successfully!");
      setSelectedSlot("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to schedule meeting");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-meeting p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Schedule a Meeting</h3>
      <select
        value={selectedSlot}
        onChange={(e) => setSelectedSlot(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select a time slot</option>
        {availableSlots.map((slot) => (
          <option key={slot} value={slot}>
            {new Date(slot).toLocaleString()}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSchedule}
        disabled={loading || !selectedSlot}
        className={`w-full p-2 rounded text-white ${
          loading || !selectedSlot ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Scheduling..." : "Schedule Meeting"}
      </button>
    </div>
  );
};

export default ScheduleMeeting;