"use client";

import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskFormModal } from "../components/task-form-modal";
import { TaskCard } from "../components/task-card";

export default function Home() {
  const { tasks, addTask, updateTaskStatus } = useTasks();

  // Sync tasks with localStorage when they change
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      parsedTasks.forEach((task) => {
        if (!tasks.some((t) => t.id === task.id)) {
          addTask(task);
        }
      });
    }
  }, [tasks, addTask]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completeTask = (id) => {
    updateTaskStatus(id, "completed");
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Tasks</h1>
      <TaskFormModal onAddTask={addTask} />
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pendingTasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={completeTask} />
        ))}
      </div>
    </div>
  );
}
