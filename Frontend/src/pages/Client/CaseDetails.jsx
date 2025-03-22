// frontend/src/CaseDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

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
      // Mock API call - replace with real endpoint later
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
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        {/* Header */}
        <Header displayName={userData?.fullName || "Client"} practiceAreas="Client" />

        {/* Case Details Content */}
        <div className="flex-1 p-6 mt-16">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Case Details</h2>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete Case
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Subject</label>
                <p className="text-gray-800 font-medium">{caseData.subject}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <p className="text-gray-800">{caseData.description || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <p
                  className={`text-gray-800 font-medium capitalize ${
                    caseData.status === "ongoing" ? "text-emerald-600" : "text-orange-600"
                  }`}
                >
                  {caseData.status}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Created At</label>
                <p className="text-gray-800">
                  {new Date(caseData.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Assigned Lawyer</label>
                <p className="text-gray-800">{caseData.lawyer?.fullName || "Not assigned"}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate("/client-dashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Are you sure?
                </h3>
                <p className="text-gray-600 mb-6">
                  Deleting this case ({caseData.subject}) is permanent. Continue?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;