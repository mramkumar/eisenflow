import React from "react";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { CheckCircle, Circle, StopCircle, Play, Edit3, Trash2 } from "lucide-react";

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.completed ? "#e0e0e0" : "#fff")};
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: ${(props) => (props.isDragging ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none")};
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
`;

const TaskContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const TaskCheckbox = styled.div`
  cursor: pointer;
  margin-right: 10px;
`;

const TaskText = styled.div`
  flex: 1;
  cursor: pointer;
`;

const TaskIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TaskIcon = styled.div`
  cursor: pointer;
  color: ${(props) => props.hoverColor};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

const TaskDueDate = styled.input`
  border: none;
  background: none;
  font-size: 0.9rem;
  color: #555;
`;

const TaskTimer = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #555;
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
          {task.completed ? <CheckCircle size={16} color="green" /> : <Circle size={16} />}
        </TaskCheckbox>
        <TaskText onClick={() => { setCurrentTask(task); setShowViewPopup(true); }}>
          {task.title}
        </TaskText>
        <TaskIconContainer>
          <TaskTimer>
            {formatTime(task.timer)}
            {!task.completed && (
              <TaskIcon hoverColor="#2196f3" onClick={() => toggleTaskTimer(task.id)}>
                {task.isRunning ? <StopCircle size={16} /> : <Play size={16} />}
              </TaskIcon>
            )}
          </TaskTimer>
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
    return "0:00:00";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

export default Task;