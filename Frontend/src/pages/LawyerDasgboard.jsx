import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import axios from "axios";
import { toast } from "react-toastify";

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
                Hello, {lawyerData?.fullName || "Guest"}!
              </h2>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Email:</span>{" "}
                {lawyerData?.email || "No email"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Contact:</span>{" "}
                {lawyerData?.contact || "No contact"}
              </p>
              <div className="flex space-x-4 mt-4">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => navigate('/chat')}
                >
                  Chat
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={handleLogout} // Connect the logout button to the handleLogout function
                >
                  Logout
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={handleLogout} // Connect the logout button to the handleLogout function
                >
                  Pakaya
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;