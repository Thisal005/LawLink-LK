import React, { useState } from 'react';
import { Grid, FileText, Settings, Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 to-blue-900 text-white flex-shrink-0 rounded-tr-3xl rounded-br-3xl z-40 transition-all duration-300 w-64 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-12">
            <div className="text-2xl font-bold tracking-tight">
              <img
                onClick={() => navigate("/")}
                style={{ cursor: 'pointer' }}
                src="./images/hori.png"
                alt="Sidebar Logo"
                className="block"
              />
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden ml-auto text-white focus:outline-none"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-4">
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              aria-label="Go to Dashboard"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/view-cases");
              }}
              aria-label="View Cases"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">View Cases</span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/settings");
              }}
              aria-label="Go to Settings"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </a>
          </nav>

          {/* Active Cases Section */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-4 px-4 text-white/70">ACTIVE CASES</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="font-medium">Smith vs. Johnson</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-sm font-medium">Estate Planning</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-sm font-medium">Corporate Merger</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 mt-16 "
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Hamburger Menu Button for mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 bg-blue-600 text-white rounded-lg lg:hidden z-50 focus:outline-none"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;