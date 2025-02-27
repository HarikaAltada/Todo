import React, { useEffect, useState } from "react";
import TaskColumn from "./TaskColumn";
import TaskSummaryColumn from "./TaskSummaryColumn";
import { Task } from "../types";
import "../styles/taskBoard.css";
import SearchBar from "./SearchBar";


const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // <-- Add search state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);


  return (
    <div>
   <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <div className="task-board">
      <TaskSummaryColumn setTasks={setTasks}  tasks={tasks} />
      <TaskColumn
        title="To Do"
        tasks={tasks.filter((t) => t.status === "To Do")}
        setTasks={setTasks}
        searchQuery={searchQuery}
        
      />
      <TaskColumn
        title="On Progress"
        tasks={tasks.filter((t) => t.status === "On Progress")}
        setTasks={setTasks}
        searchQuery={searchQuery}
      />
      <TaskColumn
        title="Done"
        tasks={tasks.filter((t) => t.status === "Done")}
        setTasks={setTasks}
        searchQuery={searchQuery}
      />
      <TaskColumn
        title="Timeout"
        tasks={tasks.filter((t) => t.status === "Timeout")}
        setTasks={setTasks}
        searchQuery={searchQuery}
      />
    </div>
    </div>
  );
};

export default TaskBoard;
