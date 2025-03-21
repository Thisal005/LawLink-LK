// frontend/src/pages/Dashboard/Lawyer/Components/LawyerAccountSettings.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../Components/LawyerHeader";
import axios from "axios";
import { toast } from "react-toastify";

const LawyerAccountSettings = () => {
  const { backendUrl, lawyerData, setLawyerData } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    profilePic: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lawyerData?._id) {
      toast.error("Please log in to edit your settings.");
      navigate("/lawyer-login");
    } else {
      setFormData({
        fullName: lawyerData.fullName || "",
        email: lawyerData.email || "",
        contact: lawyerData.contact || "",
        profilePic: null,
      });
      setPhotoPreview(lawyerData.profilePic || "./images/profilepic.jpg");
      setLoading(false);
    }
  }, [lawyerData, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files[0]) {
      setFormData((prev) => ({ ...prev, profilePic: files[0] }));
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("contact", formData.contact);
    if (formData.profilePic) {
      formDataToSend.append("profilePic", formData.profilePic);
    }

    try {
      const response = await axios.put(`${backendUrl}/api/user/update`, formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setLawyerData(response.data.userData);
        toast.success("Account updated successfully!");
        navigate("/lawyer-dashboard");
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  const displayName = lawyerData?.fullName || "Counselor";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={displayName} practiceAreas={lawyerData?.practiceAreas || "Lawyer"} />
        <div className="flex-1 p-6 mt-16">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Account Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div>
                  <label className="text-sm text-gray-600">Profile Picture</label>
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., +94 123 456 789"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/lawyer-dashboard")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAccountSettings;