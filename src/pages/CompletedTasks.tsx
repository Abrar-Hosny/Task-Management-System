"use client";

import { useTasks } from "../context/TaskContext";
import { TaskCard } from "../components/task-card";
import { motion } from "framer-motion";

export default function CompletedTasks() {
  const { tasks } = useTasks(); // Get tasks from context

  // Filter completed tasks
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full mb-6">
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
