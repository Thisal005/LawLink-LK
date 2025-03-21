import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext"; // Adjusted path to match first code
import { toast } from "react-toastify";
import { FaComments, FaVideo } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useConversation from "../zustand/useConversation"; // From first code
import Header from "../Components/Header"; // From first code
import Sidebar from "../Components/LawyerSidebar"; // From first code
import CaseCard from "../Components/dashboard/lawyer/CaseCardForLawyer"; // From first code
import TaskForm from "../Components/dashboard/lawyer/assignTask"; // From first code
import NoteForm from "../Components/dashboard/lawyer/CreateNote"; // From first code
import TodoList from "../Components/ToDoList"; // From first code
import AssignedTasks from "../Components/dashboard/lawyer/AssignedTasks"; // From first code
import LawyerAvailability from "../Components/dashboard/lawyer/AvailabilityForMeetings"; // From first code
import ChatButton from "../Components/ChatButton"; // From first code
import PDFSummerizer from "../Components/dashboard/lawyer/PdfSummerizer"; // From first code
import ScheduledMeetings from "../Components/scheduledMeetings"; // From first code

function Case() {
  const { backendUrl, userData } = useContext(AppContext); // Using userData from second code
  const navigate = useNavigate();
  const { caseId } = useParams(); // Dynamic caseId from URL params (second code)
  const { setSelectedConversation } = useConversation();

  const [caseData, setCaseData] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch case details and participants
  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseId) {
        toast.error("No case ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch case details
        const caseRes = await axios.get(`${backendUrl}/api/case/${caseId}`, {
          withCredentials: true,
        });
        console.log("Case data:", caseRes.data);
        setCaseData(caseRes.data.data || caseRes.data); // Adjust based on API response structure

        // Fetch participants
        const participantsRes = await axios.get(`${backendUrl}/api/case/${caseId}/participants`, {
          withCredentials: true,
        });
        if (participantsRes.data.success) {
          setClientId(participantsRes.data.data.clientId);
          setSelectedConversation({
            _id: participantsRes.data.data.clientId,
            isLawyer: false,
          });
        }
      } catch (error) {
        console.error("Error fetching case:", error.response?.data || error.message);
        if (error.response?.status === 403) {
          toast.error("You don’t have permission to view this case");
        } else if (error.response?.status === 404) {
          toast.error("Case not found");
        } else {
          toast.error(error.response?.data?.msg || "Failed to load case details");
        }
        setCaseData(null);
        setClientId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId, backendUrl, setSelectedConversation]);

  return (
    <div>
      <Header />
      <Sidebar activeTab="Dashboard" />
      <main className="ml-64 p-6 lg:p-8 pt-24">
        {/* Case Overview */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-6">
              {loading ? (
                <p>Loading case details...</p>
              ) : caseData ? (
                <>
                  <CaseCard caseId={caseId} />
                  <div className="flex flex-row gap-5">
                    <button
                      onClick={() => navigate("/chat")}
                      className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md shadow-md transition-all transform hover:scale-105 active:scale-95 text-sm"
                    >
                      <FaComments className="h-5 w-10 mr-1" />
                      Chat
                    </button>
                    <button
                      onClick={() => navigate("/chat")}
                      className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 px-3 rounded-md shadow-md transition-all transform hover:scale-105 active:scale-95 text-sm"
                    >
                      <FaVideo className="h-5 w-10 mr-1" />
                      Video Call
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No case details available.</p>
              )}
            </div>
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <video
                  src="images/case.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-full h-[180px] object-cover rounded-lg"
                  aria-label="Legal information video"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks and Assigned Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[400px]">
              {loading ? (
                <p>Loading task form...</p>
              ) : caseData && clientId ? (
                <TaskForm caseId={caseId} clientId={clientId} />
              ) : (
                <p className="text-gray-600">No case selected to assign tasks.</p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[400px]">
              {loading ? (
                <p>Loading assigned tasks...</p>
              ) : caseData && clientId ? (
                <AssignedTasks caseId={caseId} clientId={clientId} />
              ) : (
                <p className="text-gray-600">No case selected to view tasks.</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes, Scheduled Meetings, and Todo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="grid grid-rows-1 md:grid-rows-2 gap-5">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[300px]">
                {loading ? (
                  <p>Loading note form...</p>
                ) : caseData && clientId ? (
                  <NoteForm caseId={caseId} clientId={clientId} />
                ) : (
                  <p className="text-gray-600">No case selected to add notes.</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[200px]">
                {loading ? (
                  <p>Loading scheduled meetings...</p>
                ) : (
                  <ScheduledMeetings />
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              <TodoList />
            </div>
          </div>
        </div>

        {/* Additional Components */}
        <PDFSummerizer />
        <LawyerAvailability />
        <ChatButton />
      </main>
    </div>
  );
}

export default Case;