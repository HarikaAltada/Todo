import React,{useState} from "react";
import TaskCard from "./TaskCard";
import { Task } from "../types";
import "../styles/taskColumn.css";
import TaskPopup from "./TaskPopup";

type TaskColumnProps = {
    title: string;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    searchQuery: string;
};

const TaskColumn: React.FC<TaskColumnProps> = ({ title, searchQuery, tasks, setTasks }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closePopup = () => {
    setSelectedTask(null);
  };

    const updateTaskInList = (updatedTask: Task) => {
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
          );
          return updatedTasks;
        });
      };
      
      const deleteTaskFromList = (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      };
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return (
        <div className="task-column">
            <h2>{title}</h2>
            {filteredTasks.map((task) => (
        <TaskCard key={task._id} task={task} onUpdateTask={updateTaskInList} onClick={handleTaskClick} onDeleteTask={deleteTaskFromList} />
      ))}
 {/* Show TaskPopup if a task is selected */}
 {selectedTask && <TaskPopup task={selectedTask} onClose={closePopup} />}

        </div>
    );
};

export default TaskColumn;

