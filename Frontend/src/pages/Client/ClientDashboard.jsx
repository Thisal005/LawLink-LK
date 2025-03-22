import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext"; // Path from first code
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useConversation from "../../zustand/useConversation"; // From first code
import Header from "../../Components/dashboard/client/ClientHeader"; // From first code
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar"; // Fixed typo
import CaseCard from "../../Components/CaseCardForClient"; // From first code
import TaskList from "../../Components/TaskList"; // From first code
import NoteList from "../../Components/NoteList"; // From first code
import ScheduledMeetings from "../../Components/scheduledMeetings"; // From first code
import ScheduleMeeting from "../../Components/ScheduleMeeting"; // From first code
import ChatButton from "../../Components/dashboard/client/ClientChatButton"; // From first code

function ClientDashboard() {
  const { userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [lawyerId, setLawyerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(true); // Added from second code

  // Fetch user's cases
  useEffect(() => {
    const fetchUserCases = async () => {
      if (!userData?._id) {
        console.log("No user ID available");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/case/user/${userData._id}`, {
          withCredentials: true,
        });
        console.log("User cases response:", res.data);
        const fetchedCases = res.data.data || [];
        setCases(fetchedCases);
        if (fetchedCases.length > 0) {
          setSelectedCaseId(fetchedCases[0]._id); // Default to first case
        }
      } catch (error) {
        console.error("Error fetching user cases:", error.response?.data || error.message);
        if (error.response?.status === 403) {
          toast.error("You don’t have permission to view cases");
        } else {
          toast.error(error.response?.data?.msg || "Failed to fetch cases");
        }
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCases();
  }, [userData, backendUrl]);

  // Fetch participants for selected case
  useEffect(() => {
    if (!selectedCaseId || !userData) return;

    const fetchCaseParticipants = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/case/${selectedCaseId}/participants`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setLawyerId(res.data.data.lawyerId);
          setSelectedConversation({
            _id: res.data.data.lawyerId,
            isLawyer: true,
          });
        }
      } catch (error) {
        console.error("Error fetching case participants:", error);
        toast.error("Failed to load case participants");
      }
    };

    fetchCaseParticipants();
  }, [selectedCaseId, userData, backendUrl, setSelectedConversation]);

  return (
    <div>
      <Header />
      <ClientSidebar activeTab="Dashboard" />
      <main className="ml-64 p-6 lg:p-8 pt-24">
        {/* Welcome Section */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 w-full mb-6 mt-15 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Welcome back, {userData?.fullName || "Counselor"}
              </h2>
              {loading ? (
                <p>Loading cases...</p>
              ) : selectedCaseId ? (
                <CaseCard caseId={selectedCaseId} />
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg">
                    It looks like you don’t have any cases yet. Let’s get started!
                  </p>
                  <button
                    onClick={() => navigate("/post-case")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all"
                  >
                    Create Your First Case
                  </button>
                </div>
              )}
            </div>
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg">
                <video
                  src="images/lawyer2.mp4" // Kept first code's path; adjust if using second code's import
                  autoPlay
                  loop
                  muted
                  className="w-full h-[240px] object-cover rounded-lg"
                  aria-label="Legal information video"
                />
              </div>
            </div>
          </div>
        </div>

      
        {/* Quick Start Guide - Added from second code */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 hover:shadow-2xl">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
              <h4 className="font-medium text-gray-800">Learn the Basics</h4>
              <p className="text-gray-600">Watch a tutorial on managing your cases.</p>
              <a href="/tutorial" className="text-indigo-600 hover:underline">
                Watch Now
              </a>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
              <h4 className="font-medium text-gray-800">Contact Support</h4>
              <p className="text-gray-600">Need help? Reach out to our team.</p>
              <button
                onClick={() => navigate("/support")}
                className="text-indigo-600 hover:underline"
              >
                Get Support
              </button>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
              <h4 className="font-medium text-gray-800">Explore Features</h4>
              <p className="text-gray-600">Discover what you can do with your dashboard.</p>
              <a href="/features" className="text-indigo-600 hover:underline">
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Tasks and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              {loading ? (
                <p>Loading tasks...</p>
              ) : selectedCaseId ? (
                <TaskList caseId={selectedCaseId} />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg">No tasks yet.</p>
                  <p>Create a case to start adding tasks!</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              {loading ? (
                <p>Loading notes...</p>
              ) : selectedCaseId ? (
                <NoteList />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg">No notes yet.</p>
                  <p>Add a case to start taking notes!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Retain ChatButton component from first code */}
        <ChatButton />
      </main>
    </div>
  );
}

export default ClientDashboard;