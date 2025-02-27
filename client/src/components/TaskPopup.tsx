import React from "react";
import { Task } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCalendarAlt, faExclamationCircle, faClock, faCheckCircle, faFlask,faCircleCheck
  } from "@fortawesome/free-solid-svg-icons";
import "../styles/taskPopup.css"
type TaskPopupProps = {
  task: Task | null;
  onClose: () => void;
};

const TaskPopup: React.FC<TaskPopupProps> = ({ task, onClose }) => {
    if (!task) return null;
    const formattedDeadline = new Date(task.deadline).toLocaleDateString("en-GB");

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
          case "in research":
            return faFlask;
          case "in progress":
            return faClock;
          case "completed":
            return faCheckCircle;
          default:
            return faClock;
        }
      };
    return (
      <div className="task-popup-overlay">
        <div className="task-popup">
          <button className="close-btn" onClick={onClose}>✖</button>
  
          {/* Title */}
          <h2 className="task-title">{task.title}</h2>
  
          {/* Task Metadata */}
          <div className="task-meta">
            
  
            <div className="task-row">
            <FontAwesomeIcon icon={getStatusIcon(task.status)} className="icon status-icon" />
            <span className="label">Status:</span>
            <span className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>
              {task.status}
            </span>
            </div>
  
            <div className="task-row">
            <FontAwesomeIcon icon={faCircleCheck} className="icon" />
              <span className="label">Priority:</span>
              <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
  
            <div className="task-row">
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              <span className="label">Due Date:</span>
              <span>{formattedDeadline}</span>
            </div>
  
        
           
          </div>
  
          {/* Project Description */}
          <div className="task-description">
            <p>{task.description}</p>
          </div>
        </div>
      </div>
    );
  };
  

export default TaskPopup;
