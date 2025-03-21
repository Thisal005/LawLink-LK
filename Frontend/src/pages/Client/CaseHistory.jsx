// frontend/src/CaseHistory.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Clock, CheckCircle, Loader2 } from "lucide-react"; // Icons for status

const CaseHistory = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      if (!userData?._id) {
        toast.error("Please log in to view your cases.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/case/user/${userData._id}`, {
          withCredentials: true,
        });
        console.log("Cases response:", response.data);
        if (response.data.success) {
          setCases(response.data.data || []);
        } else {
          toast.error(response.data.msg || "Failed to fetch cases.");
          setCases([]);
        }
      } catch (error) {
        console.error("Error fetching cases:", error.response?.data || error.message);
        toast.error(error.response?.data?.msg || "Something went wrong.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [backendUrl, userData, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "ongoing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const displayName = userData?.fullName || "Client";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={displayName} practiceAreas="Client" />
        <div className="flex-1 p-6 mt-16 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Cases</h2>
            {cases.length === 0 ? (
              <div className="text-center text-gray-600 py-10">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg">You haven’t posted any cases yet.</p>
                <button
                  onClick={() => navigate("/post-case")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Post a Case
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map((caseItem) => (
                  <div
                    key={caseItem._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/case/${caseItem._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600">
                          {caseItem.subject}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {caseItem.description.substring(0, 100)}
                          {caseItem.description.length > 100 ? "..." : ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Court Date: {new Date(caseItem.courtDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(caseItem.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(caseItem.status)}
                        <span
                          className={`text-sm font-medium capitalize ${
                            caseItem.status === "pending"
                              ? "text-yellow-600"
                              : caseItem.status === "ongoing"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {caseItem.caseType} |{" "}
                      <span className="font-medium">District:</span> {caseItem.district}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseHistory;