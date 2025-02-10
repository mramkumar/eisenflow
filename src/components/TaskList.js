import React from "react";
import styled from "styled-components";
import Task from "./Task";

const TaskListContainer = styled.div`
  min-height: 100px;
  max-height: calc(50vh - 120px);
  overflow-y: auto;
`;

function TaskList({
  quadrant,
  tasks,
  setTaskDueDate,
  toggleTaskCompletion,
  deleteTask,
  toggleTaskTimer,
  reorderTask,
  setCurrentTask,
  setShowEditPopup,
  setShowViewPopup,
}) {
  const quadrantTasks = tasks.filter((task) => task.quadrant === quadrant);

  return (
    <TaskListContainer>
      {quadrantTasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          quadrant={quadrant}
          setTaskDueDate={setTaskDueDate}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          toggleTaskTimer={toggleTaskTimer}
          reorderTask={reorderTask}
          setCurrentTask={setCurrentTask}
          setShowEditPopup={setShowEditPopup}
          setShowViewPopup={setShowViewPopup}
        />
      ))}
    </TaskListContainer>
  );
}

export default TaskList;