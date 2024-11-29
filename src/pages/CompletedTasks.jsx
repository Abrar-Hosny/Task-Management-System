import React, { useEffect, useState } from "react";

function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);

  // Fetch tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filteredTasks = storedTasks.filter((task) => task.status === "Completed");
    setCompletedTasks(filteredTasks);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Completed Tasks</h1>

      {completedTasks.length === 0 ? (
        <p className="text-gray-500">No completed tasks to display.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
            >
              {/* Ensure title wraps properly */}
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white break-words">
                {task.title}
              </h5>
              {/* Ensure description wraps properly */}
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-400 break-words">
                {task.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Start Date: {task.startDate}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                End Date: {task.endDate}
              </p>
              <div className="mt-4">
                <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompletedTasks;
