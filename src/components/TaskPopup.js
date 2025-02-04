import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { X } from "lucide-react";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const PopupInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const PopupTextarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
`;

const PopupSelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const PopupButton = styled.button`
  padding: 10px;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1976d2;
  }
`;

const CloseIcon = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #555;
`;

const TaskPopup = ({ showPopup, setShowPopup, addTask }) => {
  const [newTask, setNewTask] = useState({ text: "", description: "", dueDate: "", quadrant: 1 });

  useEffect(() => {
    if (showPopup) {
      const currentDate = new Date().toISOString().split("T")[0];
      setNewTask((prevTask) => ({ ...prevTask, dueDate: currentDate }));
    }
  }, [showPopup]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleAddTask();
      }
    };

    if (showPopup) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup, newTask]);

  const handleAddTask = () => {
    if (!newTask.text.trim()) return;
    addTask(newTask);
    setShowPopup(false);
    setNewTask({ text: "", description: "", dueDate: "", quadrant: 1 });
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
    }
  };

  if (!showPopup) return null;

  return (
    <PopupOverlay onClick={handleClose}>
      <PopupContent>
        <CloseIcon onClick={() => setShowPopup(false)}>
          <X size={24} />
        </CloseIcon>
        <h3>Add Task</h3>
        <PopupInput
          type="text"
          placeholder="Task Name"
          value={newTask.text}
          onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        />
        <PopupTextarea
          placeholder="Task Description"
          value={newTask.description}
          maxLength={500}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <PopupInput
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <PopupSelect
          value={newTask.quadrant}
          onChange={(e) => setNewTask({ ...newTask, quadrant: parseInt(e.target.value) })}
        >
          <option value={1}>Important & Urgent</option>
          <option value={2}>Important & Not Urgent</option>
          <option value={3}>Not Important & Urgent</option>
          <option value={4}>Not Important & Not Urgent</option>
        </PopupSelect>
        <PopupButton onClick={handleAddTask}>Add Task</PopupButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default TaskPopup;