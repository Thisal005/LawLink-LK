// frontend/src/PostCaseForm.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ClietnSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader"; 
import { 
  FileText, 
  Briefcase, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  Clock,
  Info,
  Shield,
  Book,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
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
  const [noCourtDate, setNoCourtDate] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [pendingCasesCount, setPendingCasesCount] = useState(0);
  const [showTips, setShowTips] = useState(true);

  // Case types data with categories
  const caseTypes = {
    "Criminal Law": [
      "Criminal Defense",
      "Drug Offenses",
      "DUI/DWI",
      "White Collar Crimes",
      "Assault & Battery",
      "Theft & Burglary"
    ],
    "Civil Law": [
      "Contract Disputes",
      "Property Law",
      "Personal Injury",
      "Medical Malpractice",
      "Professional Negligence",
      "Defamation"
    ],
    "Family Law": [
      "Divorce",
      "Child Custody",
      "Adoption",
      "Domestic Violence",
      "Child Support",
      "Alimony"
    ],
    "Corporate Law": [
      "Business Formation",
      "Mergers & Acquisitions",
      "Corporate Governance",
      "Securities Law",
      "Intellectual Property",
      "Employment Law"
    ],
    "Other Areas": [
      "Immigration",
      "Tax Law",
      "Bankruptcy",
      "Environmental Law",
      "Estate Planning",
      "Administrative Law"
    ]
  };

  // Districts by region
  const districts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"]
  };

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
    if (!userData?._id) {
      setError("You must be logged in to create a case.");
      toast.error("Please log in to post a case.");
      return;
    }
    if (!agreed) {
      setError("You must agree to post this case anonymously.");
      toast.error("Please agree to the anonymity terms.");
      return;
    }
    if (pendingCasesCount >= 3) {
      setError("You've reached your limit of 3 pending cases!");
      toast.error("You've reached your limit of 3 pending cases!");
      return;
    }

    setLoading(true);
    setError(null);

    const finalFormData = {
      ...formData,
      courtDate: noCourtDate ? "" : formData.courtDate,
    };

    try {
      const response = await fetch(`${backendUrl}/api/case/create-case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create case");
      }

      await response.json();
      toast.success("Your case is now live!");
      setPendingCasesCount((prev) => prev + 1);
      navigate("/client-dashboard");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ClietnSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={userData?.fullName || "Client"} practiceAreas="Client" />
        
        <main className="flex-1 flex items-start justify-center p-4 md:p-8 pt-20 lg:pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-4xl border border-slate-200 relative"
          >
            {/* Accent corner */}
            <div className="absolute top-0 right-0 w-38 h-32 overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-500 to-blue-600 rotate-45 transform origin-bottom-left w-12 h-64"></div>
            </div>

            {/* Header section */}
            <div className="mb-8 relative z-10">
              <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                Post a Case Anonymously
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-2xl">
                Share your legal matter discreetly while connecting with qualified attorneys. 
                All case information remains anonymous until you choose to engage with a legal professional.
              </p>
            </div>

            {/* Prominent Case Limit Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${pendingCasesCount >= 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${pendingCasesCount >= 3 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  {pendingCasesCount >= 3 ? 
                    <AlertTriangle className="w-5 h-5" /> : 
                    <Info className="w-5 h-5" />
                  }
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${pendingCasesCount >= 3 ? 'text-red-700' : 'text-amber-700'}`}>
                    {pendingCasesCount >= 3 ? 'Case Limit Reached' : 'Case Limit Information'}
                  </h3>
                  <p className={`text-xs mt-1 ${pendingCasesCount >= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                    {pendingCasesCount >= 3 
                      ? 'You have reached your maximum of 3 pending cases. Please wait for attorneys to respond or close existing cases before posting a new one.' 
                      : `You currently have ${pendingCasesCount}/3 pending cases. Each client is limited to 3 pending cases at a time.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Key Info Indicators */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                <Calendar className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  <span className="font-semibold">14-day</span> active posting
                </span>
              </div>
              
              <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  <span className="font-semibold">You</span> choose the attorney
                </span>
              </div>
              
              <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-3">
                <Shield className="text-amber-500 w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  <span className="font-semibold">100%</span> anonymous posting
                </span>
              </div>
            </div>

            {/* Tips Section - Collapsible */}
            <div className="mb-6 border border-blue-100 rounded-lg overflow-hidden">
              <div 
                className="p-4 bg-blue-50 flex justify-between items-center cursor-pointer"
                onClick={() => setShowTips(!showTips)}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-700">Important Tips for Posting Your Case</h3>
                </div>
                <button className="text-blue-700">
                  {showTips ? "Hide" : "Show"}
                </button>
              </div>
              
              {showTips && (
                <div className="p-4 bg-white border-t border-blue-100">
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Be specific</strong> about your legal issue without revealing personal identifiers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Include relevant dates</strong> such as incident dates, filing deadlines, or hearing dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Clearly state your objectives</strong> (compensation, defense, advice, representation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Avoid including</strong> full names, addresses, ID numbers, or contact information</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Alert messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center gap-2 border border-blue-100"
              >
                <Clock className="w-5 h-5 animate-spin" />
                <span className="text-sm">Submitting your case...</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> 
                    Case Subject
                  </span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Property Boundary Dispute"
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 text-sm"
                  disabled={loading || pendingCasesCount >= 3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" /> 
                      Case Type
                    </span>
                  </label>
                  <select
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 text-sm"
                    disabled={loading || pendingCasesCount >= 3}
                    required
                  >
                    <option value="">Select case type</option>
                    
                    {Object.entries(caseTypes).map(([category, types]) => (
                      <optgroup key={category} label={category}>
                        {types.map((type) => (
                          <option key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                            {type}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> 
                      District
                    </span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 text-sm"
                    disabled={loading || pendingCasesCount >= 3}
                    required
                  >
                    <option value="">Select district</option>
                    
                    {Object.entries(districts).map(([province, provinceDistricts]) => (
                      <optgroup key={province} label={province}>
                        {provinceDistricts.map((district) => (
                          <option key={district} value={district.toLowerCase()}>
                            {district}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" /> 
                    Court Date <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </span>
                </label>
                <input
                  type="date"
                  name="courtDate"
                  value={formData.courtDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-sm"
                  disabled={loading || noCourtDate || pendingCasesCount >= 3}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                  class="box"
                    type="checkbox"
                    id="noCourtDate"
                    checked={noCourtDate}
                    onChange={(e) => setNoCourtDate(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    disabled={loading || pendingCasesCount >= 3}
                  />
                  <label htmlFor="noCourtDate" className="text-xs text-slate-600">
                    No court date scheduled yet
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> 
                    Case Description
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide details of your case without including sensitive personal information..."
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 resize-none h-32 text-sm"
                  disabled={loading || pendingCasesCount >= 3}
                  required
                />
                
                {/* Enhanced Description Tips */}
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                  <p className="font-medium text-slate-700 mb-1">Suggested information to include:</p>
                  <ul className="space-y-1">
                    <li>• Key dates related to your case (incidents, filings, deadlines)</li>
                    <li>• Legal questions or concerns you have</li>
                    <li>• Your objectives and desired outcomes</li>
                    <li>• Relevant background information without personal identifiers</li>
                  </ul>
                </div>
              </div>

              {/* Anonymity Agreement - Enhanced */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    disabled={loading || pendingCasesCount >= 3}
                  />
                  <div>
                    <label htmlFor="agree" className="text-sm font-medium text-blue-700">
                      Anonymous Posting Agreement
                    </label>
                    <p className="text-xs text-blue-600 mt-1">
                      I confirm this post contains no sensitive personal information that could identify me or other parties involved.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-medium text-blue-700">Your Privacy Protection</h4>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-600">Your identity remains anonymous until you choose to reveal it to a specific attorney</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-600">Your case will be visible to qualified attorneys for 14 days</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-600">You have full control over which attorney you select to handle your case</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`flex items-center justify-center gap-2 w-full p-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all text-sm font-medium shadow-sm ${
                    loading || !agreed || pendingCasesCount >= 3 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading || !agreed || pendingCasesCount >= 3}
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Submitting..." : pendingCasesCount >= 3 ? "Case Limit Reached" : "Post Case Anonymously"}
                </button>
                <p className="mt-2.5 text-center text-xs text-slate-500">
                  By posting, you agree to our <span className="text-blue-600 cursor-pointer">Terms of Service</span> and <span className="text-blue-600 cursor-pointer">Privacy Policy</span>
                </p>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default PostCaseForm;