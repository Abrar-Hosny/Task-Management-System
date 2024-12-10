import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define a type for your task (without "inProcess" status)
type Task = {
  id: string; // or number, depending on how you generate IDs
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'completed'; // Removed 'inProcess' from the status
};

// Create the TaskContext with the proper types
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, newStatus: 'pending' | 'completed') => void;
  removeTask: (taskId: string) => void;
}

// Create the TaskContext with default values (empty values will be overridden later)
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

// TaskProvider component to wrap the app and provide the context value
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  // State to hold all tasks in a single array (initialized as an empty array)
  const [tasks, setTasks] = useState<Task[]>([]);

  // Function to add a new task
  const addTask = (task: Task) => {
    setTasks((prevState) => [...prevState, task]);
  };

  // Function to update a task's status
  const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'completed') => {
    setTasks((prevState) =>
      prevState.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Function to remove a task
  const removeTask = (taskId: string) => {
    setTasks((prevState) => prevState.filter((task) => task.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};
