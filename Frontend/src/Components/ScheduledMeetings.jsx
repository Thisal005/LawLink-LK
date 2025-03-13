import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/meetings", {
          withCredentials: true,
        });
        setMeetings(res.data.data);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const joinMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  if (loading) return <p>Loading meetings...</p>;

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
                <p>Case: {meeting.caseId.title}</p>
                <p>{new Date(meeting.scheduledAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => joinMeeting(meeting.meetingId)}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
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