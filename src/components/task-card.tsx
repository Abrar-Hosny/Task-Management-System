import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CheckCircle } from "lucide-react";

export function TaskCard({ task, onComplete }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onComplete(task.id)}
            variant="outline"
            className="w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
