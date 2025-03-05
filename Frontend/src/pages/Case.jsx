import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { FaComments, FaVideo, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CaseCard from "../Components/dashboard/lawyer/CaseCard";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import TaskForm from "../Components/dashboard/lawyer/assignTask";
import NoteForm from "../Components/dashboard/lawyer/CreateNote";
import TodoList from "../Components/ToDoList";

/**
 * Case component for displaying case details and related actions.
 */
function Case() {
  // Initialize navigation hook
  const navigate = useNavigate();

  // Client and case IDs for API calls or data fetching
  const clientId = "67c7fe29bc4d0952007bfa5a";
  const caseId = "67c8000fc05fc45a8fbf5978";

  return (
    <div>
      {/* Header component */}
      <Header />
      
      {/* Sidebar component with active tab set to "Dashboard" */}
      <Sidebar activeTab="Dashboard" />

      {/* Main content area */}
      <main className="ml-64 p-6 lg:p-8 pt-24">
        
        {/* Card for displaying case information */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          {/* Dynamic background elements for visual effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>

          {/* Flex container for organizing content */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            {/* Left section for case card and buttons */}
            <div className="flex-1 space-y-6">
              {/* CaseCard component with case ID */}
              <CaseCard caseId={caseId} />

              {/* Buttons for navigating to chat and video call */}
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
            </div>

            {/* Right section for video display */}
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Video element for legal information */}
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

        {/* TaskForm component for assigning tasks */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          <TaskForm caseId={caseId} clientId={clientId} />
        </div>

        {/* Grid layout for note forms and todo list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-rows-1 md:grid-rows-2 gap-5">
            {/* NoteForm component for creating notes */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[300px]">
                <NoteForm caseId={caseId} clientId={clientId} />
              </div>
            </div>

            {/* Another NoteForm for additional notes */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[200px]">
                <NoteForm caseId={caseId} clientId={clientId} />
              </div>
            </div>
          </div>

          {/* TodoList component for displaying tasks */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              <TodoList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Case;
