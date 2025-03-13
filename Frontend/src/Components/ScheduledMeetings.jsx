import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meetings", { withCredentials: true });
        setMeetings(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const joinMeeting = (meetingId) => navigate(`/meeting/${meetingId}`);

  if (loading) return <p>Loading meetings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="scheduled-meetings p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Scheduled Meetings</h3>
      {meetings.length === 0 ? (
        <p>No scheduled meetings</p>
      ) : (
        <ul className="space-y-2">
          {meetings.map((meeting) => (
            <li key={meeting._id} className="flex justify-between items-center p-2 border-b">
              <div>
                <p><strong>Case:</strong> {meeting.caseId.title}</p>
                <p><strong>Time:</strong> {new Date(meeting.scheduledAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {meeting.status}</p>
              </div>
              <button
                onClick={() => joinMeeting(meeting.meetingId)}
                disabled={meeting.status !== "scheduled" || new Date(meeting.scheduledAt) > new Date()}
                className={`px-4 py-1 rounded text-white ${
                  meeting.status === "scheduled" && new Date(meeting.scheduledAt) <= new Date()
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400"
                }`}
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledMeetings;