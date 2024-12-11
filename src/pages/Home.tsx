"use client";

import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskFormModal } from "../components/task-form-modal";
import { TaskCard } from "../components/task-card";
import { motion } from "framer-motion";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Home() {
  const { tasks, addTask, updateTaskStatus, isLoading } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completeTask = (id) => {
    updateTaskStatus(id, "completed");
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");

  return (
    <div className="w-full h-full">
      <main className="w-full h-full p-4 space-y-8">
        <div className="fixed bottom-0 transform -translate-x-1/2 left-[50%] md:left-[60%] z-50 bg-white">
          <PlusCircle
            className="flex items-center justify-center w-20 h-20 transition-all rounded-full text-primary hover:scale-110 hover:bg-primary hover:text-primary-foreground"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
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
                <TaskCard task={task} onComplete={completeTask} />
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
