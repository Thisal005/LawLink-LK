// components/TaskCard.jsx
import React from "react";
import useUpdateTaskStatus from "../../../hooks/useUpdateTaskStatus";

const TaskCard = ({ task, onUpdate }) => {
  const { loading, updateTaskStatus } = useUpdateTaskStatus();

  const handleStatusChange = async () => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    const updatedTask = await updateTaskStatus(task._id, newStatus);
    if (updatedTask) {
      onUpdate(); // Refresh the task list
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold">{task.taskName}</h3>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <p className="mt-2">
        Status:{" "}
        <span
          className={`font-semibold ${
            task.status === "completed" ? "text-green-500" : "text-orange-500"
          }`}
        >
          {task.status}
        </span>
      </p>
      <button
        onClick={handleStatusChange}
        disabled={loading}
        className="mt-4 w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-green-300"
      >
        {loading ? "Updating..." : `Mark as ${task.status === "pending" ? "Completed" : "Pending"}`}
      </button>
    </div>
  );
};

export default TaskCard;