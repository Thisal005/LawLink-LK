// hooks/useFetchCase.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";


const useFetchCase = (caseId) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId) return;

      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/case/${caseId}`, {
          withCredentials: true,
        });
        console.log("caseId:", caseId, "Response:", res.data);

        setCaseData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching case:", error.response?.data || error.message);
        toast.error(error.response?.data?.msg || "Failed to fetch case details");
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId, backendUrl]);

  return { caseData, loading };
};

export default useFetchCase;