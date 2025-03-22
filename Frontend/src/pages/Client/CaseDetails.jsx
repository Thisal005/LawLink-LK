// frontend/src/CaseDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";
import axios from "axios";
import { toast } from "react-toastify";

import { 
  Trash2, 
  ArrowLeft, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  Info, 
  Shield, 
  Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

const CaseDetails = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const { id } = useParams(); // Case ID from URL
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!userData?._id) {
        toast.error("Please log in to view case details.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/case/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          setCaseData(data.data);
        } else {
          throw new Error("No case data found");
        }
      } catch (error) {
        console.error("Failed to fetch case details:", error);
        toast.error("Failed to load case details.");
        navigate("/client-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id, backendUrl, userData, navigate]);

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.delete(`${backendUrl}/api/case/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Case deleted successfully!");
        navigate("/client-dashboard");
      } else {
        throw new Error(response.data.msg || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete case.");
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200"
      >
        <p className="text-indigo-700 text-xl font-semibold flex items-center gap-3 tracking-wide">
          <Clock className="w-8 h-8 animate-spin text-indigo-500" />
          Loading Case Details...
        </p>
      </motion.div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
      {/* Sidebar */}
      <ClientSidebar/>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        {/* Header */}
        <Header displayName={userData?.fullName || "Client"} practiceAreas="Client" />

        {/* Case Details Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-8 mt-16 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-10 border border-indigo-100 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(79, 70, 229, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative Sparkles */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 text-indigo-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-full h-full opacity-30" />
              </motion.div>

              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-bold text-indigo-800 flex items-center gap-3 tracking-tight z-10">
                  <Briefcase className="w-9 h-9 text-indigo-500 animate-[pulse_2s_infinite]" />
                  Case Overview
                </h2>
                {caseData.status === "pending" && (
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg text-lg font-medium z-10"
                  >
                    <Trash2 className="w-6 h-6 animate-[wiggle_1s_infinite]" />
                    Delete Case
                  </motion.button>
                )}
              </div>

              {/* Case Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FileText className="w-6 h-6 text-indigo-500 mt-1 animate-[fadeIn_0.5s_ease-in]" />
                    <div>
                      <label className="text-sm text-indigo-600 font-semibold tracking-wide flex items-center gap-1">
                        <Info className="w-4 h-4" /> Subject
                      </label>
                      <p className="text-gray-900 text-xl font-semibold">{caseData.subject}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <AlertCircle className="w-6 h-6 text-indigo-500 mt-1 animate-[fadeIn_0.5s_ease-in]" />
                    <div>
                      <label className="text-sm text-indigo-600 font-semibold tracking-wide flex items-center gap-1">
                        <Info className="w-4 h-4" /> Description
                      </label>
                      <p className="text-gray-800 text-base leading-relaxed">{caseData.description || "Not provided"}</p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle
                      className={`w-6 h-6 ${
                        caseData.status === "ongoing" ? "text-emerald-500" : "text-orange-500"
                      } animate-[pulse_2s_infinite]`}
                    />
                    <div>
                      <label className="text-sm text-indigo-600 font-semibold tracking-wide flex items-center gap-1">
                        <Shield className="w-4 h-4" /> Status
                      </label>
                      <p
                        className={`text-xl font-semibold capitalize ${
                          caseData.status === "ongoing" ? "text-emerald-600" : "text-orange-600"
                        }`}
                      >
                        {caseData.status}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Clock className="w-6 h-6 text-indigo-500 animate-[spin_4s_linear_infinite]" />
                    <div>
                      <label className="text-sm text-indigo-600 font-semibold tracking-wide flex items-center gap-1">
                        <Info className="w-4 h-4" /> Created At
                      </label>
                      <p className="text-gray-800 text-base">
                        {new Date(caseData.createdAt).toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <User className="w-6 h-6 text-indigo-500 animate-[bounce_2s_infinite]" />
                    <div>
                      <label className="text-sm text-indigo-600 font-semibold tracking-wide flex items-center gap-1">
                        <Info className="w-4 h-4" /> Assigned Lawyer
                      </label>
                      <p className="text-gray-800 text-base">
                        {caseData.lawyerId?.fullName || "Awaiting Assignment"}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Back Button */}
              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/client-dashboard")}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg text-lg font-medium"
                >
                  <ArrowLeft className="w-6 h-6 animate-[wiggle_1s_infinite]" />
                  Return to Dashboard
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Confirmation Modal */}
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl border border-indigo-100 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
              >
                {/* Modal Sparkles */}
                <motion.div
                  className="absolute top-0 left-0 w-16 h-16 text-red-200"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-full h-full opacity-40" />
                </motion.div>

                <h3 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-3 tracking-tight z-10">
                  <AlertCircle className="w-7 h-7 text-red-500 animate-[pulse_1.5s_infinite]" />
                  Confirm Deletion
                </h3>
                <p className="text-gray-700 mb-8 text-base leading-relaxed z-10">
                  Are you certain you wish to permanently delete{" "}
                  <span className="font-semibold text-indigo-700">"{caseData.subject}"</span>? This action cannot be undone.
                </p>
                <div className="flex gap-6 justify-end z-10">
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg text-lg font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Yes, Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(false)}
                    className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-full hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-lg text-lg font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Custom Animation Keyframes
const wiggle = {
  rotate: [0, 5, -5, 5, 0],
  transition: { duration: 0.5, repeat: Infinity },
};

export default CaseDetails;