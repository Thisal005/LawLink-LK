import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "../Components/ClientSideBar";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import CaseCard from "../Components/CaseCard";
import TaskList from "../Components/TaskList";
import NoteList from "../Components/NoteList";

/**
 * Home component for displaying the main dashboard.
 */
function Home() {
  // Extract user data from AppContext
  const { userData } = useContext(AppContext);

  // Initialize navigation hook
  const navigate = useNavigate();

  // Case ID for fetching case-related data
  const caseId = "67c7380108bf373cb2b0916a";

  return (
    <div>
      {/* Header component */}
      <Header />
      
      {/* Sidebar component with active tab set to "Dashboard" */}
      <Sidebar activeTab="Dashboard" />

      {/* Main content area */}
      <main className="ml-64 p-6 lg:p-8 pt-24">
        
        {/* Welcome Card */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-6 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          {/* Dynamic background elements for visual effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>

          {/* Flex container for organizing content */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-8">
              {/* Welcome message with user's full name */}
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Welcome back, {userData?.fullName || "Counselor"}
              </h2>

              {/* CaseCard component with case ID */}
              <CaseCard caseId={caseId} />
            </div>

            {/* Right Section - Video */}
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg">
                {/* Video element for legal information */}
                <video
                  src="images/lawyer2.mp4"
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

        {/* Grid layout for task and note lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TaskList component */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              <TaskList caseId={caseId} />
            </div>
          </div>

          {/* NoteList component */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              <NoteList />
            </div>
          </div>
        </div>

        {/* Button to navigate to chat */}
        <button 
          onClick={() => navigate("/chat")} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
        >
          Chat
        </button>
      </main>
    </div>
  );
}

export default Home;
