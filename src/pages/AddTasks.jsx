import React, { useState, useEffect } from "react";

function AddTasks() {
  // State to manage tasks
  const [tasks, setTasks] = useState([]);

  // State to manage new task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  // State to manage task added successfully message
  const [successMessage, setSuccessMessage] = useState("");

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle form submission to add a task
  const handleAddTask = (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (
      newTask.title.trim() &&
      newTask.description.trim() &&
      newTask.startDate &&
      newTask.endDate
    ) {
      // Add a unique ID and add task to the tasks array
      const taskWithId = {
        ...newTask,
        id: Date.now(), // Unique ID based on the current timestamp
      };

      // Update tasks state with the new task
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, taskWithId];

        // Save tasks to localStorage
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // Log updated tasks to the console
        console.log("Updated Tasks:", updatedTasks);

        return updatedTasks;
      });

      // Reset the form fields
      setNewTask({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Pending",
      });

      // Show success message for task added
      setSuccessMessage("Task added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="border border-black p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Task</h2>

        {/* Task form */}
        <form onSubmit={handleAddTask}>
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Task title"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Task Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Task description"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="startDate"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newTask.startDate}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="endDate"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newTask.endDate}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2.5 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Add Task
          </button>
        </form>

        {/* Display success message */}
        {successMessage && (
          <div className="mt-4 text-green-500 font-semibold">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddTasks;
