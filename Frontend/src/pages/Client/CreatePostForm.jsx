// frontend/src/PostCaseForm.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ClietnSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader"; 

function PostCaseForm() {
  const { userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    caseType: "",
    district: "",
    courtDate: "",
    description: "",
    clientId: userData?._id || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [pendingCasesCount, setPendingCasesCount] = useState(0);
  const [notification, setNotification] = useState(null);

  console.log("PostCaseForm rendered", { userData, backendUrl });

  useEffect(() => {
    const fetchPendingCases = async () => {
      if (!userData?._id) return;
      try {
        const response = await fetch(`${backendUrl}/api/case/pending-count/${userData._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setPendingCasesCount(data.count);
        } else {
          console.error("Error fetching pending cases:", data.msg);
        }
      } catch (err) {
        console.error("Error fetching pending cases:", err);
      }
    };
    fetchPendingCases();
  }, [userData, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", { formData, agreed });

    if (!userData?._id) {
      setError("You must be logged in to create a case.");
      console.log("No user ID");
      return;
    }
    if (!agreed) {
      setError("You must agree to post this case anonymously.");
      console.log("Agreement not checked");
      return;
    }
    if (pendingCasesCount >= 3) {
      setError("You’ve reached your limit of 3 pending cases!");
      setNotification("You’ve reached your limit of 3 pending cases!");
      console.log("Pending cases limit reached");
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Fetching started");

    try {
      const response = await fetch(`${backendUrl}/api/case/create-case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      console.log("Fetch response received", { status: response.status });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Fetch error data", errorData);
        throw new Error(errorData.msg || "Failed to create case");
      }

      const result = await response.json();
      console.log("Case created successfully:", result);
      setNotification("Your case is now live!");
      setPendingCasesCount((prev) => prev + 1);
      navigate("/client-dashboard");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Loading reset");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClietnSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={userData?.fullName || "Client"} practiceAreas="Client" />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 lg:pt-24">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-4xl border-t-4 border-blue-600">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-4">
              Post a Case Anonymously
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Please avoid including sensitive or personal information.
            </p>

            {notification && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                {notification}
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            {loading && (
              <div className="mb-6 p-3 bg-blue-100 text-blue-700 rounded-lg text-center">
                Submitting your case, please wait...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-lg font-medium text-blue-600 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Property Dispute"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <label className="block text-lg font-medium text-blue-600 mb-2">
                    Case Type
                  </label>
                  <select
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                    required
                  >
                    <option value="">Select case type</option>
                    <option value="criminal">Criminal</option>
                    <option value="civil">Civil</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-blue-600 mb-2">
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                    required
                  >
                    <option value="">Select district</option>
                    <option value="colombo">Colombo</option>
                    <option value="gampaha">Gampaha</option>
                    <option value="kandy">Kandy</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-blue-600 mb-2">
                  Court Date
                </label>
                <input
                  type="date"
                  name="courtDate"
                  value={formData.courtDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={loading}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-blue-600 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a general description (no personal details)"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
                  disabled={loading}
                  required
                />
              </div>

              <div className="mb-6 flex items-center justify-center">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor="agree" className="ml-2 text-sm text-gray-700 font-medium">
                  I agree to post this case anonymously and confirm it contains no sensitive information.
                </label>
              </div>

              <div className="mb-6 text-center text-sm text-gray-600">
                Note: Cases expire after 14 days if no lawyer takes them.
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full w-full max-w-md transition-colors duration-200 ${
                    loading || !agreed || pendingCasesCount >= 3 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading || !agreed || pendingCasesCount >= 3}
                >
                  {loading ? "Submitting..." : "Post Case"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PostCaseForm;