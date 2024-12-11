"use client";

import { useTasks } from "../context/TaskContext";
import { TaskCard } from "../components/task-card";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CompletedTasks() {
  const { completedTasks, fetchTasks, isLoading } = useTasks();

  // Fetch completed tasks when the component mounts
  useEffect(() => {
    fetchTasks("COMPLETED");
  }, [fetchTasks]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Loading completed tasks...</p>
      </div>
    );
  }

  // Render when no completed tasks
  if (completedTasks.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No completed tasks found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className="text-2xl font-bold">Completed Tasks</h1>
      </div>

      {/* Tasks Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {completedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
