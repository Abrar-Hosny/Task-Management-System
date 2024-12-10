"use client";

import { useState, useEffect } from "react";
import { TaskFormModal } from "../components/task-form-modal";
import { TaskCard } from "../components/task-card";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: any) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
  };

  const completeTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task
      )
    );
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
