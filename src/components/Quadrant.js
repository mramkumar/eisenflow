import React from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import TaskList from "./TaskList";

const QuadrantCell = styled.td`
  transition: background-color 0.3s ease;
  height: calc(50vh - 60px);
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #ddd;
  width: 50%;
`;

function Quadrant({
  quadrant,
  tasks,
  moveTask,
  reorderTask,
  setTaskDueDate,
  toggleTaskCompletion,
  deleteTask,
  toggleTaskTimer,
  setCurrentTask,
  setShowEditPopup,
  setShowViewPopup,
}) {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.quadrant !== quadrant) {
        moveTask(item.id, quadrant);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const quadrantTasks = tasks.filter((task) => task.quadrant === quadrant);

  return (
    <QuadrantCell ref={drop} style={{ backgroundColor: isOver ? "#e0f7fa" : "#fafafa" }}>
      <TaskList
        quadrant={quadrant}
        tasks={quadrantTasks}
        setTaskDueDate={setTaskDueDate}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        toggleTaskTimer={toggleTaskTimer}
        reorderTask={reorderTask}
        setCurrentTask={setCurrentTask}
        setShowEditPopup={setShowEditPopup}
        setShowViewPopup={setShowViewPopup}
      />
    </QuadrantCell>
  );
}

export default Quadrant;