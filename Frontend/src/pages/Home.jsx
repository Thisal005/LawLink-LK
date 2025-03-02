import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import axios from "axios";
import { toast } from "react-toastify";

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

  return (
    <div >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-[60px]">
        <Sidebar />
        <div className="flex-1 p-6">
          
        </div>
      </div>
    </div>
  );
}

export default Home;