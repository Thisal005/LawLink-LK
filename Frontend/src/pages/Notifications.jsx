import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import NotificationList from "../Components/NotificationList";

function Notifications() {
  return (
    <div>
      <Header />
      <Sidebar activeTab="Dashboard" />

      {/* Main content section*/}
      <main className="ml-64 p-6 lg:p-8 pt-24">
        {/* Card-like container for the notification list */}
        <div
          className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-5 
                      relative overflow-hidden transform transition-all duration-300 
                      hover:shadow-2xl w-290"
        >
          {/* NotificationList component to render the list of notifications */}
          <NotificationList />
        </div>
      </main>
    </div>
  );
}

export default Notifications;