import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
import { toast } from "react-toastify";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meetings", {
          withCredentials: true,
        });
        console.log("Fetched meetings:", res.data.data);
        setMeetings(res.data.data);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        toast.error("Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();

    if (socket) {
      socket.on("newMeeting", (meeting) => {
        setMeetings((prev) => [...prev, meeting]);
        toast.info(`New meeting scheduled: ${meeting.caseTitle} at ${new Date(meeting.scheduledAt).toLocaleString()}`);
      });
    }

    return () => {
      if (socket) socket.off("newMeeting");
    };
  }, [socket]);

  const joinMeeting = async (meetingId) => {
    try {
      console.log("Attempting to join meeting:", meetingId);
      const res = await axios.get(`http://localhost:5000/api/meetings/join/${meetingId}`, {
        withCredentials: true,
      });
      console.log("Join response:", res.data);
      if (res.data.success) {
        console.log("Navigating to:", `/meeting/${meetingId}`);
        navigate(`/meeting/${meetingId}`);
      }
    } catch (err) {
      console.error("Join error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to join meeting");
    }
  };

  if (loading) return <p>Loading meetings...</p>;

  return (
    <div className="scheduled-meetings p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Scheduled Meetings</h3>
      {meetings.length === 0 ? (
        <p>No scheduled meetings</p>
      ) : (
        <ul className="space-y-2">
          {meetings.map((meeting) => {
            const now = new Date();
            const scheduledAt = new Date(meeting.scheduledAt);
            // const canJoin = (scheduledAt - now) / (1000 * 60) <= 5 && meeting.status !== "completed"; // Original
            const canJoin = true; // Temporary for testing
            return (
              <li key={meeting._id} className="flex justify-between items-center p-2 border-b">
                <div>
                  <p>Case: {meeting.caseId.title}</p>
                  <p>{scheduledAt.toLocaleString()}</p>
                  <p>Status: {meeting.status}</p>
                </div>
                <button
                  onClick={() => joinMeeting(meeting.meetingId)}
                  disabled={!canJoin}
                  className={`px-4 py-1 rounded text-white ${
                    canJoin ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Join
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ScheduledMeetings;