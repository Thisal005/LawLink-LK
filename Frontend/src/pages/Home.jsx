import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import Sidebar from "../Components/sideBar";
import Header from "../Components/Header";

function Home() {
  const { userData, lawyerData } = useContext(AppContext);

  return (
    <div className="min-h-screen w-380 bg-gray-100 font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Home Page</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Hello, {userData?.fullName || lawyerData?.fullName || "Guest"}!
              </h2>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Email:</span>{" "}
                {userData?.email || lawyerData?.email || "No email"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Contact:</span>{" "}
                {userData?.contact || lawyerData?.contact || "No contact"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;