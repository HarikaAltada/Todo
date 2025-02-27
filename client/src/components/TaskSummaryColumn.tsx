import React, { useState, useEffect } from "react";
import "../styles/taskSummaryColumn.css";
import { Task } from "../types";

// Define the props type
interface TaskSummaryColumnProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  tasks: Task[];  // Accept tasks as a prop
}

const TaskSummaryColumn: React.FC<TaskSummaryColumnProps> = ({ setTasks, tasks  }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Low",
    deadline: "",
  });

  const togglePopup = () => setShowPopup(!showPopup);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [expiredTaskCount, setExpiredTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  
  useEffect(() => {
    const today = new Date();
  
    // Identify expired tasks (deadline passed & not "Done")
    const expiredTasks = tasks.filter((task) => {
      const taskDeadline = new Date(task.deadline);
      return taskDeadline < today && task.status !== "Done";
    });
  
    setExpiredTaskCount(expiredTasks.length);
  
    // Move expired tasks to "Timeout"
    if (expiredTasks.length > 0) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          expiredTasks.includes(task) ? { ...task, status: "Timeout" } : task
        )
      );
    }
  
    // Filter active tasks (excluding expired ones)
    const activeTasks = tasks.filter(
      (task) =>
        (task.status === "To Do" || task.status === "On Progress"|| task.status==="Done") &&
        !expiredTasks.includes(task) // Exclude expired tasks
    );
  
    setActiveTaskCount(activeTasks.length);
  
    // Filter completed tasks
    const completedTasks = tasks.filter((task) => task.status === "Done");
    setCompletedTaskCount(completedTasks.length);
  
    // Update total task count (excluding expired tasks)
    const validTasks = tasks.filter((task) => !expiredTasks.includes(task));
    setTotalTaskCount(validTasks.length);
  }, [tasks, setTasks]);
  
  
  const taskSummaryData = [
    {
      id: 1,
      icon: "./assets/Frame 1171275857.png",
      title: "Expired Tasks",
      count: expiredTaskCount,
    },
    {
      id: 2,
      icon: "./assets/Frame 1171275856.png",
      title: "All Active Tasks",
      count: activeTaskCount,
    },
    {
      id: 3,
      icon: "./assets/Frame 1171275859.png",
      title: "Completed Tasks",
      count: `${completedTaskCount}/${totalTaskCount}`, 
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setTaskDetails((prevDetails) => {
      let updatedDetails = { ...prevDetails, [name]: value };

      // If status is "Done", force priority to "Completed"
      if (name === "status" && value === "Done") {
        updatedDetails.priority = "Completed";
      }

      // If priority is changed to "High" or "Low", ensure status is not "Done"
      if (name === "priority" && (value === "High" || value === "Low")) {
        if (prevDetails.status === "Done") {
          updatedDetails.status = "To Do"; // Reset status to prevent conflict
        }
      }

      return updatedDetails;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskDetails),
      });

      if (response.ok) {
        const newTask = await response.json();

        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks, newTask];
          

          // Update active task count dynamically
          const activeTasks = updatedTasks.filter(
            (task) => task.status === "To Do" || task.status === "On Progress"
          );
          setActiveTaskCount(activeTasks.length);

          // Update completed task count dynamically
          const completedTasks = updatedTasks.filter(
            (task) => task.status === "Done"
          );
          setCompletedTaskCount(completedTasks.length);

          return updatedTasks;
        });

        setTaskDetails({
          title: "",
          description: "",
          status: "To Do",
          priority: "Low",
          deadline: "",
        });

        setShowPopup(false);
      } else {
        console.error("Error adding task");
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <div className="task-summary-column">
      {taskSummaryData.map((task) => (
        <div key={task.id} className="task-summary-card">
          <div className="task-main">
            <div className="icon-wrapper">
              <img src={task.icon} alt={task.title} />
            </div>
            <div className="task-summary-content">
              <p className="task-title">{task.title}</p>
              <p className="task-count">
                {task.id === 2 ? activeTaskCount : task.count}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button className="add-task-btn" onClick={togglePopup}>
        + Add Task
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskDetails.title}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Task Description"
                value={taskDetails.description}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={taskDetails.status}
                onChange={handleChange}
              >
                <option value="To Do">To Do</option>
                <option value="On Progress">On Progress</option>
                <option value="Done">Done</option>
                {/* <option value="Timeout">Timeout</option> */}
              </select>
              <select
                name="priority"
                value={taskDetails.priority}
                onChange={handleChange}
              >
                {taskDetails.status === "Done" ? (
                  <option value="Completed">Completed</option>
                ) : (
                  <>
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                  </>
                )}
              </select>
              <input
                type="date"
                name="deadline"
                value={taskDetails.deadline}
                onChange={handleChange}
                required
              />
              <div className="popup-buttons">
                <button type="submit">Add Task</button>
                <button type="button" onClick={togglePopup}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSummaryColumn;
