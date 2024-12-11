import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CheckCircle, Trash2 } from "lucide-react";
import { useTasks } from "../context/TaskContext";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export function TaskCard({ task }: { task: Task }) {
  const { updateTaskStatus, deleteTask } = useTasks();

  const handleComplete = () => {
    updateTaskStatus(task.id, "COMPLETED");
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          {task.status !== "COMPLETED" && (
            <Button
              onClick={handleComplete}
              variant="outline"
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 " />
            </Button>
          )}
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 " />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
