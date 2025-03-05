// components/TaskForm.jsx
import React, { useState } from "react";
import useCreateTask from "../../../hooks/useCreateTask";
import useFetchAssignedTasks from "../../../hooks/useFetchAssignedTask";
import LawyerTaskCard from "./LawyerTaskCard";

const TaskForm = ({ caseId, clientId }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const { loading: createLoading, createTask } = useCreateTask();
  const { tasks, loading: fetchLoading, fetchAssignedTasks } =
    useFetchAssignedTasks(clientId, caseId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = await createTask(taskName, description, clientId, caseId);
    if (task) {
      setTaskName("");
      setDescription("");
      fetchAssignedTasks(); // Refresh the task list
    }
  };

  return (
    <div className="p-8 bg-white text-gray-900 rounded-3xl  mb-6 relative overflow-hidden  border border-gray-200 hover:border-blue-500 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer ">
  {/* Dynamic background elements */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
  </div>

  {/* Content container */}
  <div className="relative z-10">
    {/* Header Section */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center transition-transform hover:scale-110">
        <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(74,222,128,0.3)]"></span>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">ASSIGN TASKS</h2>
    </div>

    {/* Divider */}
    <div className="h-[5px] bg-green-500 rounded-full hover:bg-green-300 mb-8"></div>

    {/* Task Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 resize-none"
        rows={2}
        required
      />
      <button
        type="submit"
        disabled={createLoading}
        className="w-full p-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {createLoading ? "Assigning..." : "Assign Task"}
      </button>
    </form>

    {/* Assigned Tasks Section */}
    
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-semibold text-gray-800">Assigned Tasks</h4>
        <div className="h-[2px] bg-green-200 flex-1 ml-4 rounded-full"></div>
      </div>

      <div
          className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default"
          aria-label="Task list"
        >
        {fetchLoading ? (
          <p className="text-gray-500 text-center py-4">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => <LawyerTaskCard key={task._id} task={task} />)
        ) : (
          <p className="text-gray-500 text-center py-4">No tasks assigned yet.</p>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default TaskForm;