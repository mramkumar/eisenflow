import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { CheckCircle, Circle, StopCircle, Play, Edit3, Trash2 } from "lucide-react";
import styled from "styled-components";

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  transform: ${({ isDragging }) => (isDragging ? "scale(0.95)" : "scale(1)")};
  box-shadow: ${({ isDragging }) => (isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none")};
  background-color: ${({ completed }) => (completed ? "#e8f5e9" : "#fff")};
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  color: ${({ completed }) => (completed ? "#666" : "#000")};
  width: 100%;
`;

const TaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const TaskCheckbox = styled.span`
  cursor: pointer;
  color: #64b5f6;
`;

const TaskText = styled.span`
  flex: 1;
  text-align: left;
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px; /* Fixed length for task title */
  cursor: pointer;
`;

const TaskTimer = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #555;
`;

const TaskIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0; /* Prevent shrinking */
  margin-left: auto; /* Push icons to the right */
`;

const TaskIcon = styled.span`
  cursor: pointer;
  color: #555;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ hoverColor }) => hoverColor};
  }
`;

const TaskDueDate = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  font-size: 0.9rem;
`;

function Task({
  task,
  index,
  quadrant,
  setTaskDueDate,
  toggleTaskCompletion,
  deleteTask,
  toggleTaskTimer,
  reorderTask,
  setCurrentTask,
  setShowEditPopup,
  setShowViewPopup,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index, quadrant },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item) => {
      if (item.id !== task.id && item.quadrant === quadrant) {
        const dragIndex = item.index;
        const hoverIndex = index;
        reorderTask(item.id, hoverIndex, quadrant);
        item.index = hoverIndex;
      }
    },
  });

  return (
    <TaskItem ref={(node) => drag(drop(node))} isDragging={isDragging} completed={task.completed}>
      <TaskContent>
        <TaskCheckbox onClick={() => toggleTaskCompletion(task.id)}>
          {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
        </TaskCheckbox>
        <TaskText onClick={() => { setCurrentTask(task); setShowViewPopup(true); }}>
          {task.title}
        </TaskText>
        <TaskIconContainer>
          <TaskTimer>
            {formatTime(task.timer)}
            <TaskIcon hoverColor="#2196f3" onClick={() => toggleTaskTimer(task.id)}>
              {task.isRunning ? <StopCircle size={16} /> : <Play size={16} />}
            </TaskIcon>
          </TaskTimer>
          <TaskIcon hoverColor="#ff9800" onClick={() => { setCurrentTask(task); setShowEditPopup(true); setShowViewPopup(false); }}>
            <Edit3 size={16} />
          </TaskIcon>
          <TaskIcon hoverColor="#d32f2f" onClick={() => deleteTask(task.id)}>
            <Trash2 size={16} />
          </TaskIcon>
          <TaskDueDate
            type="date"
            value={task.dueDate}
            onChange={(e) => setTaskDueDate(task.id, e.target.value)}
          />
        </TaskIconContainer>
      </TaskContent>
    </TaskItem>
  );
}

function formatTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

export default Task;