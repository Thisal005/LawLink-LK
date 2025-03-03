// components/TaskList.jsx
import React from "react";
import useFetchTasks from "../hooks/useFetchTask";
import TaskCard from "../Components/dashboard/client/Tasks";

/**
 * A component that displays a list of tasks for a given case ID.
 *
 * @param {string} caseId - The ID of the case to fetch tasks for.
 * @returns {ReactElement} A React element containing the task list.
 */

const TaskList = ({ caseId }) => {
  const { tasks, loading } = useFetchTasks(caseId);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Tasks for Case #{caseId}</h3>
      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} onUpdate={() => {}} />
        ))
      ) : (
        <p className="text-gray-600">No tasks found for this case.</p>
      )}
    </div>
  );
};

export default TaskList;