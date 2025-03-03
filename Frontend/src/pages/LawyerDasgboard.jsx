import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import Calender from "../Components/dashboard/Calender";
import BasicLineChart from "../Components/dashboard/Linechart";
import BasicTimeClock from "../Components/dashboard/Clock";
import TaskForm from "../Components/dashboard/lawyer/assignTask";


function Home() {
  const { 
    lawyerData, 
    setLawyerData, 
    backendUrl, // Add this from context
    setIsLoggedIn // Add this from context
  } = useContext(AppContext);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear the cookie
      await axios.post(backendUrl + '/api/lawyer/logout', {}, {
        withCredentials: true
      });
      
      // Update state
      setIsLoggedIn(false);
      setLawyerData(null); 
      
      // Redirect to login
      navigate('/lawyer-login');
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const upcomingEvents = [
    { id: 1, title: "Client Meeting - Smith vs. Jones", time: "Today, 2:00 PM", type: "Meeting" },
    { id: 2, title: "Court Hearing - Johnson Case", time: "Tomorrow, 9:30 AM", type: "Hearing" },
    { id: 3, title: "Document Submission Deadline", time: "Mar 5, 5:00 PM", type: "Deadline" }
  ];

  return (
    <div>
      <Header />
      <Sidebar activeTab="Dashboard" />
  
      {/* Main content */}
      <main className="ml-64 p-6 lg:p-8 pt-24">
        {/* Welcome Card */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-6 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          {/* Dynamic background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
  
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                  Welcome back, {lawyerData?.fullName || "Counselor"}
                </h2>
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  3 upcoming events today
                </p>
              </div>
  
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Active Cases Card */}
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Active Cases</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-400 mt-1">+2 from last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
                    </div>
                  </div>
                </div>
  
                {/* Completed Cases Card */}
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-green-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Completed Cases</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-400 mt-1">+1 from last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                    </div>
                  </div>
                </div>
  
                {/* Clients Card */}
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Clients</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-400 mt-1">+3 from last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Section - Video */}
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg">
                <video
                  src="images/lawyer.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-full h-[240px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Earnings Chart and Upcoming Events in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
              Earnings Overview
            </h2>
            <div className="h-[280px]">
              <BasicLineChart />
            </div>
          </div>
  
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-2"></span>
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <TaskForm/>
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