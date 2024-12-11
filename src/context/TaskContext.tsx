"use client";

import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface TaskContextType {
  tasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (status: string) => Promise<Task[]>;
  addTask: (taskData: any) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  completedTasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => [],
  addTask: async () => {},
  updateTaskStatus: async () => {},
  deleteTask: async () => {},
});

import { ReactNode } from "react";

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the entire auth context
  const authContext = useAuth();

  // Generalized fetch tasks method
  const fetchTasks = useCallback(
    async (status: string) => {
      // Ensure we have both getUserId and isAuthenticated
      if (!authContext || !authContext.isAuthenticated) {
        console.error("User not authenticated");
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        // Safely get userId
        const userId = authContext.getUserId?.();
        console.log(`Fetching ${status} tasks for userId:`, userId);

        if (!userId) {
          throw new Error("Unable to retrieve user ID");
        }

        const url = new URL(
          "https://rs20kjtwdh.execute-api.us-east-1.amazonaws.com/prod/tasks"
        );
        url.searchParams.append("userId", userId);
        url.searchParams.append("status", status);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${status} tasks`);
        }

        const data = await response.json();

        // Update tasks based on status
        if (status === "PENDING") {
          setTasks(data);
        } else if (status === "COMPLETED") {
          setCompletedTasks(data);
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error(`Error fetching ${status} tasks:`, err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [authContext]
  );

  // Fetch both pending and completed tasks on mount
  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchTasks("PENDING");
      fetchTasks("COMPLETED");
    }
  }, [authContext, fetchTasks]);

  // Add Task (similar improvements)
  const addTask = useCallback(
    async (taskData: any) => {
      if (!authContext || !authContext.isAuthenticated) {
        throw new Error("User not authenticated");
      }

      setIsLoading(true);
      try {
        const userId = authContext.getUserId?.();
        if (!userId) {
          throw new Error("Unable to retrieve user ID");
        }

        const response = await fetch(
          "https://rs20kjtwdh.execute-api.us-east-1.amazonaws.com/prod/tasks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...taskData,
              userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add task");
        }

        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
        return newTask;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error adding task:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authContext]
  );

  // Update Task Status (similar improvements)
  const updateTaskStatus = useCallback(
    async (taskId: any, newStatus: any) => {
      if (!authContext || !authContext.isAuthenticated) {
        throw new Error("User not authenticated");
      }

      setIsLoading(true);
      try {
        const userId = authContext.getUserId?.();
        if (!userId) {
          throw new Error("Unable to retrieve user ID");
        }

        const taskToUpdate = tasks.find((task) => task.id === taskId);
        if (!taskToUpdate) {
          throw new Error("Task not found");
        }

        const response = await fetch(
          "https://rs20kjtwdh.execute-api.us-east-1.amazonaws.com/prod/tasks",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: taskId,
              userId,
              status: newStatus,
              title: taskToUpdate.title,
              description: taskToUpdate.description,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update task status");
        }

        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error updating task status:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [authContext, tasks]
  );

  // New Delete Task method
  const deleteTask = useCallback(
    async (taskId: any) => {
      if (!authContext || !authContext.isAuthenticated) {
        throw new Error("User not authenticated");
      }

      setIsLoading(true);
      try {
        const userId = authContext.getUserId?.();
        if (!userId) {
          throw new Error("Unable to retrieve user ID");
        }

        const response = await fetch(
          "https://rs20kjtwdh.execute-api.us-east-1.amazonaws.com/prod/tasks",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: taskId,
              userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete task");
        }

        // Remove the task from the tasks array
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        // Also remove from completed tasks if it's there
        setCompletedTasks((prevCompletedTasks) =>
          prevCompletedTasks.filter((task) => task.id !== taskId)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error deleting task:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authContext]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasks,
        isLoading,
        error,
        fetchTasks,
        addTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
