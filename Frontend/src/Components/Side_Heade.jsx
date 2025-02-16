import React, { useState } from 'react';
import { Grid, FileText, Settings, Menu, X } from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-30 transition-all duration-300 ${
          isSidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-800">My Application</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-blue-600 text-white rounded-lg focus:outline-none">
              Notifications
            </button>
            <button className="p-2 bg-blue-600 text-white rounded-lg focus:outline-none">
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 to-blue-900 text-white flex-shrink-0 rounded-tr-3xl rounded-br-3xl z-40 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-12">
            <div className="text-2xl font-bold tracking-tight">
              <a href="#">
                <img
                  src="./images/hori.png"
                  alt="Logo"
                  className={`${isSidebarOpen ? 'block' : 'hidden'}`}
                />
              </a>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-4">
            <a
              href="#"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <Grid className="w-5 h-5" />
              <span className={`font-medium ${isSidebarOpen ? 'block' : 'hidden'}`}>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className={`font-medium ${isSidebarOpen ? 'block' : 'hidden'}`}>View Cases</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className={`font-medium ${isSidebarOpen ? 'block' : 'hidden'}`}>Settings</span>
            </a>
          </nav>

          {/* Active Cases Section */}
          <div className={`mt-12 ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <h3 className="text-sm font-semibold mb-4 px-4 text-white/70">ACTIVE CASES</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className={`text-sm font-medium ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  Smith vs. Johnson
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className={`text-sm font-medium ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  Estate Planning
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className={`text-sm font-medium ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  Corporate Merger
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 bg-blue-600 text-white rounded-lg z-50 focus:outline-none transition-transform duration-300 ${
          isSidebarOpen ? 'left-64' : 'left-20'
        }`}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
          <p className="text-gray-700">
            This is the main content area. It adjusts its position based on the sidebar state.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;