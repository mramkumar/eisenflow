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

const ViewTaskPopup = ({ showPopup, setShowPopup, task, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  const handleUpdateTask = () => {
    if (!editedTask.text.trim()) return;
    updateTask(editedTask);
    setIsEditing(false);
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
    }
  };

  if (!showPopup) return null;

  return (
    <PopupOverlay onClick={handleClose}>
      <PopupContent key={task.id}>
        <CloseIcon onClick={() => setShowPopup(false)}>
          <X size={24} />
        </CloseIcon>
        <h3>{isEditing ? "Edit Task" : "View Task"}</h3>
        <PopupInput
          type="text"
          placeholder="Task Name"
          value={editedTask.title || ""}
          onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
          disabled={!isEditing}
        />
        <PopupTextarea
          placeholder="Task Description"
          value={editedTask.description || ""}
          maxLength={500}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          disabled={!isEditing}
        />
        <PopupInput
          type="date"
          value={editedTask.dueDate || ""}
          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
          disabled={!isEditing}
        />
        <PopupInput
          type="text"
          value={editedTask.quadrant || ""}
          onChange={(e) => setEditedTask({ ...editedTask, quadrant: e.target.value })}
          disabled={!isEditing}
        />
        <PopupButton onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Task"}
        </PopupButton>
        {isEditing && <PopupButton onClick={handleUpdateTask}>Update Task</PopupButton>}
      </PopupContent>
    </PopupOverlay>
  );
};

export default ViewTaskPopup;