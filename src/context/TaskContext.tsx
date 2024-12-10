
// src/context/TaskContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the TaskContext
const TaskContext = createContext();

// Create a custom hook to use the context
export const useTasks = () => {
  return useContext(TaskContext);
};

// TaskProvider component to wrap the app and provide the context value
export const TaskProvider = ({ children }) => {
  // State to hold all tasks in a single array
  const [tasks, setTasks] = useState([
    // Sample tasks
    { id: 1, title: 'Study HCI', description: 'Study Human-Computer Interaction', date: '2024-11-29', status: 'pending' },
    { id: 2, title: 'Complete Assignment', description: 'Finish the project report', date: '2024-11-30', status: 'pending' },
    { id: 3, title: 'Read Book', description: 'Read the AI textbook', date: '2024-12-05', status: 'inProcess' },
  ]);

  // Function to add a new task
  const addTask = (task) => {
    setTasks((prevState) => [...prevState, task]);
  };

  // Function to update a task's status
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevState) => 
      prevState.map((task) => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Function to remove a task
  const removeTask = (taskId) => {
    setTasks((prevState) => prevState.filter((task) => task.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};