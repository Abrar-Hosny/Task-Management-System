import React, { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext"; // Import the useTasks hook
import { useNavigate } from "react-router-dom";

function PendingTasks() {
  const { tasks, updateTaskStatus, removeTask, updateTaskDetails } = useTasks(); // Access tasks, updateTaskStatus, and updateTaskDetails from context
  const [pendingTasks, setPendingTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited
  const [updatedTask, setUpdatedTask] = useState(null); // Store the updated task data
  const navigate = useNavigate();

  useEffect(() => {
    // Filter to show only "Pending" tasks from the context
    const filteredTasks = tasks.filter((task) => task.status === "Pending");
    setPendingTasks(filteredTasks);
  }, [tasks]);

  const handleTaskProcessed = (taskId) => {
    // Update task status to "In Progress" using the context's updateTaskStatus function
    updateTaskStatus(taskId, "In Progress");

    // Set a success message
    setMessage("Task marked as In Progress!");

    // Clear the success message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      removeTask(taskId); // Calls removeTask from TaskContext
      setMessage("Task deleted successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleEditTask = (taskId) => {
    // Set the task as editable
    setEditingTaskId(taskId);
    const taskToEdit = pendingTasks.find((task) => task.id === taskId);
    setUpdatedTask({ ...taskToEdit });
  };

  const handleSaveChanges = () => {
    // Save changes to the task
    if (updatedTask) {
      updateTaskDetails(updatedTask.id, updatedTask); // Update task details in context
      setEditingTaskId(null); // Exit edit mode
      setMessage("Task updated successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 mt-14">
      <h1 className="text-2xl font-bold mb-6">Pending Tasks</h1>

      {/* Display success message when a task is marked as in progress or edited */}
      {message && (
        <div className="mb-4 text-green-600 font-semibold">{message}</div>
      )}

      {pendingTasks.length === 0 ? (
        <p className="text-gray-500">No Pending tasks to display.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between"
            >
              {/* Task Title */}
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  name="title"
                  value={updatedTask.title}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
              ) : (
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white break-words">
                  {task.title}
                </h5>
              )}

              {/* Task Description */}
              {editingTaskId === task.id ? (
                <textarea
                  name="description"
                  value={updatedTask.description}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
              ) : (
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-400 break-words">
                  {task.description}
                </p>
              )}

              {/* Editable Start Date */}
              {editingTaskId === task.id ? (
                <input
                  type="date"
                  name="startDate"
                  value={updatedTask.startDate}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Start Date: {task.startDate}
                </p>
              )}

              {/* Editable End Date */}
              {editingTaskId === task.id ? (
                <input
                  type="date"
                  name="endDate"
                  value={updatedTask.endDate}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  End Date: {task.endDate}
                </p>
              )}

              {/* Editable Status */}
              {editingTaskId === task.id ? (
                <select
                  name="status"
                  value={updatedTask.status}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Status: {task.status}
                </p>
              )}

              <div className="mt-4 flex gap-2 justify-between">
                {/* Mark as In Progress Button */}
                <button
                  onClick={() => handleTaskProcessed(task.id)}
                  className="px-3 py-1 text-xs font-semibold rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
                >
                  Mark as In Progress
                </button>

                {/* Edit Button */}
                {editingTaskId === task.id ? (
                  <button
                    onClick={handleSaveChanges}
                    className="px-3 py-1 text-xs font-semibold rounded-full text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditTask(task.id)}
                    className="px-3 py-1 text-xs font-semibold rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 cursor-pointer"
                  >
                    Edit
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 text-xs font-semibold rounded-full text-red-700 bg-red-100 hover:bg-red-200 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingTasks;
