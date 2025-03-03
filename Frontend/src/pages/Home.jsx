import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import ClietnSidebar from "../Components/ClientSideBar";
import Header from "../Components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import Calender from "../Components/dashboard/Calender";
import BasicLineChart from "../Components/dashboard/Linechart";
import BasicTimeClock from "../Components/dashboard/Clock";
import LawyerNotes from "../Components/dashboard/client/LawyerNotes";

import TaskList from "../Components/TaskList";

function Home() {
  const { 
    userData, 
    setUserData, 
    backendUrl,
    setIsLoggedIn 
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + "/api/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  const stats = [
    { name: "Active Cases", value: "10", color: "blue", icon: "⚖️" },
    { name: "Completed Cases", value: "5", color: "green", icon: "✓" },
    { name: "Clients", value: "5", color: "purple", icon: "👥" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Client Meeting - Smith vs. Jones", time: "Today, 2:00 PM", type: "Meeting" },
    { id: 2, title: "Court Hearing - Johnson Case", time: "Tomorrow, 9:30 AM", type: "Hearing" },
    { id: 3, title: "Document Submission Deadline", time: "Mar 5, 5:00 PM", type: "Deadline" }
  ];

  const caseId = "A123456";

  return (
    <div >
      <Header />
      <ClietnSidebar />
      
      {/* Main content */}
      <main className="ml-64 p-6 lg:p-8 pt-24">
      <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-6 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
      {/* Dynamic background elements */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
  </div>

  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
    {/* Left Section */}
    <div className="flex-1 space-y-8">
      
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome back, {userData?.fullName || "Counselor"}
        </h2>
        
      

      {/* Case Card - Made interactive */}
      <article
        className="group bg-white border border-gray-200 p-4 rounded-2xl hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer"
        role="button"
        tabIndex="0"
        aria-label="View your case details"
        onClick={() => console.log("Navigate to case details")} // Replace with actual navigation
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs uppercase tracking-wide text-gray-600 font-semibold">Your Case</h3>
            <p className="mt-2 text-3xl font-bold text-gray-950">Estate Planning</p>
            <p className="text-xs text-gray-500 mt-1">Your Lawyer: Desahn Fernando</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm border-t border-gray-100 pt-4">
          <li className="flex items-center gap-2">
            <span className="text-gray-600">Case ID:</span>
            <span className="font-semibold text-gray-900">123456</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-600">Case Type:</span>
            <span className="font-semibold text-gray-900">Civil</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-green-700">Active</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-600">Next Court Date:</span>
            <span className="font-semibold text-gray-900">TBD</span>
          </li>
        </ul>
      </article>
    </div>

    {/* Right Section - Video */}
    <div className="self-center md:self-start">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg">
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
<LawyerNotes/>
<TaskList caseId={caseId} />
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