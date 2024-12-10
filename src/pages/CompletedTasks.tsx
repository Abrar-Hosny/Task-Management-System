"use client"

import { useEffect } from "react"
import { useTasks } from "../context/TaskContext"
import { TaskCard } from "../components/task-card"

export default function CompletedTasks() {
  const { tasks } = useTasks() // Get tasks from context

  // Filter completed tasks
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
