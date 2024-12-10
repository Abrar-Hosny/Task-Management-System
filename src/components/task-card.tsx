import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    status: string
  }
  onComplete?: (id: string) => void
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <Card className={cn("mb-4", task.status === "completed" && "bg-green-50")}>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>
        <div className="mt-2 text-sm">
          <p>Start Date: {task.startDate}</p>
          <p>End Date: {task.endDate}</p>
          <p className={task.status === "completed" ? "text-green-600 font-semibold" : ""}>
            Status: {task.status}
          </p>
        </div>
      </CardContent>
      {task.status === "pending" && onComplete && (
        <CardFooter>
          <Button onClick={() => onComplete(task.id)}>Mark as Completed</Button>
        </CardFooter>
      )}
    </Card>
  )
}

