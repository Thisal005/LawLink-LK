import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { FaComments, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CaseCard from "../Components/dashboard/lawyer/CaseCard";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import TaskForm from "../Components/dashboard/lawyer/assignTask";
import NoteForm from "../Components/dashboard/lawyer/CreateNote";
import TodoList from "../Components/ToDoList";
import AssignedTasks from "../Components/dashboard/lawyer/AssignedTasks";
import LawyerAvailability from "../Components/dashboard/lawyer/AvailabilityForMeetings";
import ChatButton from "../Components/ChatButton";


import ScheduledMeetings from "../Components/scheduledMeetings";
import useConversation from "../zustand/useConversation";
import axios from "axios";

function Case() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();
  const [clientId, setClientId] = useState(null);

  const caseId = "67cd4ab0240c311403203c96";

  useEffect(() => {
    const fetchCaseParticipants = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/case/${caseId}/participants`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setClientId(res.data.data.clientId);
          setSelectedConversation({
            _id: res.data.data.clientId,
            isLawyer: false,
          });
        }
      } catch (error) {
        console.error("Error fetching case participants:", error);
        toast.error("Failed to load case data");
      }
    };

    fetchCaseParticipants();
  }, [backendUrl, caseId, setSelectedConversation]);

  return (
    <div>
      <Header />
      <Sidebar activeTab="Dashboard" />
      <main className="ml-64 p-6 lg:p-8 pt-24">
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-6">
              <CaseCard caseId={caseId} />
              
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[400px]">
            <TaskForm caseId={caseId} clientId={clientId} />

            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[400px]">
              <AssignedTasks caseId={caseId} clientId={clientId}/>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="grid grid-rows-1 md:grid-rows-2 gap-5">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[300px]">
                <NoteForm caseId={caseId} clientId={clientId} />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[200px]">
              <ScheduledMeetings />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              <TodoList />
            </div>
          </div>
        </div>
      
        <LawyerAvailability/>
        <ChatButton/>

        
      </main>
    </div>
  );
}

export default Case;