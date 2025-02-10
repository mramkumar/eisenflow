import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import "./App.css";
import TaskPopup from "./components/TaskPopup";
import EditTaskPopup from "./components/EditTaskPopup";
import ViewTaskPopup from "./components/ViewTaskPopup";
import MatrixTable from "./components/MatrixTable";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f4f4f9;
`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const addTask = (newTask) => {
    const task = {
      id: Date.now(),
      text: newTask.text,
      description: newTask.description,
      quadrant: newTask.quadrant,
      completed: false,
      dueDate: newTask.dueDate,
      timer: 0,
      isRunning: false,
    };
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const moveTask = (taskId, newQuadrant) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, quadrant: newQuadrant } : task
      )
    );
  };

  const reorderTask = (taskId, targetIndex, targetQuadrant) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    const task = tasks[taskIndex];
    const updatedTasks = [...tasks];
    updatedTasks.splice(taskIndex, 1);
    updatedTasks.splice(targetIndex, 0, { ...task, quadrant: targetQuadrant });
    setTasks(updatedTasks);
  };

  const setTaskDueDate = (taskId, dueDate) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, dueDate } : task)));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskTimer = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isRunning: !task.isRunning } : task
      )
    );
  };

  const updateTaskTimer = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId && task.isRunning ? { ...task, timer: task.timer + 1 } : task
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        if (task.isRunning) {
          updateTaskTimer(task.id);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <MatrixTable
          tasks={tasks}
          moveTask={moveTask}
          reorderTask={reorderTask}
          setTaskDueDate={setTaskDueDate}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          toggleTaskTimer={toggleTaskTimer}
          setCurrentTask={setCurrentTask}
          setShowEditPopup={setShowEditPopup}
          setShowViewPopup={setShowViewPopup}
          setShowPopup={setShowPopup}
        />
        <TaskPopup showPopup={showPopup} setShowPopup={setShowPopup} addTask={addTask} />
        {currentTask && (
          <>
            <EditTaskPopup
              showPopup={showEditPopup}
              setShowPopup={setShowEditPopup}
              task={currentTask}
              updateTask={updateTask}
            />
            <ViewTaskPopup
              showPopup={showViewPopup}
              setShowPopup={setShowViewPopup}
              task={currentTask}
              updateTask={updateTask}
            />
          </>
        )}
      </AppContainer>
    </DndProvider>
  );
}

export default App;