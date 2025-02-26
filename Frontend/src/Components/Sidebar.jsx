import React, { useState, useEffect } from 'react';
import { Grid, FileText, Settings, Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsOpen(false); // Close sidebar by default on mobile
      } else {
        setIsMobile(false);
        setIsOpen(true); // Open sidebar by default on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-160 p-2 bg-blue-900 text-white rounded-lg z-50 focus:outline-none transition-transform duration-300 ${
          isOpen ? 'left-60' : 'left-7'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 to-blue-900 text-white flex-shrink-0 rounded-tr-3xl rounded-br-3xl z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-25'
        } ${isMobile ? 'transform translate-x-0' : 'transform translate-x-0'}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-12">
            <div className="text-2xl font-bold tracking-tight">
                <img
                  onClick={() => navigate("/")}
                  style={{ cursor: 'pointer' }}
                  src={`./images/${isOpen ? 'hori.png' : 'title_logo.png'}`}
                  alt={isOpen ? 'Sidebar Open Logo' : 'Sidebar Closed Logo'}
                  className="block"
                />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-4">
            <a
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <Grid className="w-5 h-5" />
              <span className={`font-medium ${isOpen ? 'block' : 'hidden'}`}>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className={`font-medium ${isOpen ? 'block' : 'hidden'}`}>View Cases</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-500/50 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className={`font-medium ${isOpen ? 'block' : 'hidden'}`}>Settings</span>
            </a>
          </nav>

          {/* Active Cases Section */}
          <div className={`mt-15 ${isOpen ? 'block' : 'hidden'}`}>
            <h3 className="text-sm font-semibold mb-4 px-4 text-white/70">ACTIVE CASES</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className={`font-medium ${isOpen ? 'block' : 'hidden'}`}>Smith vs. Johnson</span>
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
    </>
  );
};

export default Sidebar;