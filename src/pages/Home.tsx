"use client";

import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskFormModal } from "../components/task-form-modal";
import { TaskCard } from "../components/task-card";
import { motion } from "framer-motion";
import { Loader2, PlusCircle } from "lucide-react";

export default function Home() {
  const { tasks, addTask, updateTaskStatus, fetchTasks, isLoading } =
    useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch pending tasks when component mounts
  useEffect(() => {
    fetchTasks("PENDING");
  }, []);

  // Filter out completed tasks
  const pendingTasks = tasks.filter((task) => task.status !== "COMPLETED");

  return (
    <div className="w-full h-full">
      <main className="w-full h-full p-4 space-y-8">
        <div className="fixed bottom-0 transform -translate-x-1/2 left-[50%] md:left-[60%] z-50 bg-white">
          <PlusCircle
            className="flex items-center justify-center w-16 h-16 transition-all rounded-full hover:scale-110 hover:bg-primary hover:text-primary-foreground"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pendingTasks.map((task, index) => (
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
        )}
      </main>
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={addTask}
      />
    </div>
  );
}
