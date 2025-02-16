import React, { useState } from 'react';
import { Calendar, HelpCircle, Bell } from 'lucide-react';

const Header = ({ displayName = "John Doe", practiceAreas = "Corporate Law" }) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      message: "New case file uploaded: Smith vs. Johnson",
      date: "10 minutes ago"
    },
    {
      id: 2,
      message: "Meeting scheduled with client tomorrow at 2 PM",
      date: "1 hour ago"
    },
    {
      id: 3,
      message: "Document review deadline approaching",
      date: "2 hours ago"
    }
  ];

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
  };

  return (
    <header className="fixed top-0.5 right-0 w-full md:w-315 bg-gradient-to-l from-blue-800 to-blue-600 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm rounded-tl-full rounded-bl-full z-50">
      <h1 className="text-xl font-semibold text-gray-800"></h1>
      <div className="flex items-center gap-4 md:gap-6">
        <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
          <Calendar className="w-5 h-5 text-white" />
        </button>
        <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5 text-white" />
        </button>
        <div className="relative">
          <button 
            className="p-2 hover:bg-blue-700 rounded-full transition-colors relative"
            onClick={toggleNotifications}
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {notificationsVisible && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-4 border-b hover:bg-gray-50">
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                Mark all as read
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right">
            <div className="font-bold text-white text-sm md:text-base">{displayName}</div>
            <div className="text-xs md:text-sm text-white">{practiceAreas}</div>
          </div>
          <img 
            src="./images/profilepic.jpg"
            alt="Profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;