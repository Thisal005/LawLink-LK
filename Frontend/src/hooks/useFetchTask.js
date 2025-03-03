// hooks/useFetchTasks.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useFetchTasks = (caseId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl, userData, lawyerData } = useContext(AppContext);

  useEffect(() => {
    if (!caseId) return;

    const fetchTasks = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${backendUrl}/api/tasks/case/${caseId}`, {
          withCredentials: true,
        });

        setTasks(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, [caseId, backendUrl]);

  return { tasks, loading };
};

export default useFetchTasks;