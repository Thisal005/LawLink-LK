// components/TaskForm.jsx
import React, { useState } from "react";
import useCreateTask from "../../../hooks/useCreateTask";

const TaskForm = ({ caseId, clientId }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const { loading, createTask } = useCreateTask();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = await createTask(taskName, description, clientId, caseId);
    if (task) {
      setTaskName("");
      setDescription("");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Assign New Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {loading ? "Assigning..." : "Assign Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;