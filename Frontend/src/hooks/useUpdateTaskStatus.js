// hooks/useUpdateTaskStatus.js
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useUpdateTaskStatus = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, userData, lawyerData } = useContext(AppContext);

  const updateTaskStatus = async (taskId, status) => {
    if (!taskId || !status) {
      toast.error("Task ID and status are required");
      return;
    }

    const currentUser = userData; // Only clients can update task status
    if (!currentUser) {
      toast.error("You must be a client to update task status");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${backendUrl}/api/tasks/${taskId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Task status updated successfully!");
      setLoading(false);
      return res.data; // Return the updated task
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
      setLoading(false);
    }
  };

  return { loading, updateTaskStatus };
};

export default useUpdateTaskStatus;