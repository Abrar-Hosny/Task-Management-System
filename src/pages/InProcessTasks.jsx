import React, { useEffect, useState } from "react";

function InProcessTasks() {
  const [processedTasks, setProcessedTasks] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Filter to only show tasks that are "In Progress"
    const inProgressTasks = storedTasks.filter((task) => task.status === "In Progress");
    setProcessedTasks(inProgressTasks);
  }, []);

  // Function to mark the clicked task as completed
  const handleTaskCompletion = (taskId) => {
    // Fetch all tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Loop through all tasks, and update the clicked task's status to "Completed"
    const updatedTasks = storedTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: "Completed" };
      }
      return task;
    });

    // Update the state with the modified task list
    setProcessedTasks(updatedTasks.filter((task) => task.status === "In Progress"));

    // Save the updated task list back to localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Set the success message
    setMessage("Task marked as completed!");

    // Clear the success message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">In Process Tasks</h1>

      {/* Display success message when a task is marked as completed */}
      {message && (
        <div className="mb-4 text-green-600 font-semibold">{message}</div>
      )}

      {processedTasks.length === 0 ? (
        <p className="text-gray-500">No Processed tasks to display.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {processedTasks.map((task) => (
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
                <span
                  onClick={() => handleTaskCompletion(task.id)} // Pass task id on click
                  className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                    task.status === "In Progress"
                      ? "text-yellow-700 bg-yellow-100 dark:bg-green-900 dark:text-green-300"
                      : "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
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

export default InProcessTasks;
