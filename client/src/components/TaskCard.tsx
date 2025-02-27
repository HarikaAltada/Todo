import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/taskCard.css";
import { Task } from "../types";

type TaskCardProps = {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onClick: (task: Task) => void;
};
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
  onClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [taskDetails, setTaskDetails] = useState(task);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleEditPopup = () => {
    setShowEditPopup(!showEditPopup);
    setShowDropdown(false); // Close dropdown
  };

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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Task deleted:", task._id);
        onDeleteTask(task._id);
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating Task:", taskDetails);

    if (!taskDetails._id) {
      // Use `_id` instead of `id`
      console.error("Task ID is undefined");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskDetails._id}`,
        {
          // Use `_id`
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskDetails),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        console.log("Updated Task:", updatedTask);
        onUpdateTask(updatedTask); // Call the update function
        setShowEditPopup(false);
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const formattedDeadline = new Date(task.deadline).toLocaleDateString("en-GB");

  return (
    <div className="task-card">
      <div className="task-header">
        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <div className="dropdown-container">
          <FontAwesomeIcon
            icon={faEllipsis}
            className="ellipsis-icon"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <ul className="dropdown-menu">
              <li onClick={toggleEditPopup}>
                <FontAwesomeIcon icon={faEdit} className="icon" />
                Edit
              </li>
              <li onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} className="icon" />
                Delete
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="task-details" onClick={() => onClick(task)}>
        <h3>{task.title}</h3>
        <p className="description">{task.description}</p>
        <span className="deadline">Deadline: {formattedDeadline}</span>
      </div>
      {/* Edit Popup */}
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Edit Task</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="title"
                value={taskDetails.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
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
                <button type="submit">Update Task</button>
                <button type="button" onClick={toggleEditPopup}>
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

export default TaskCard;
