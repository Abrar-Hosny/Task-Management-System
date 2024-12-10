"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "../components/task-card"

export default function CompletedTasks() {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Completed Tasks</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {completedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

