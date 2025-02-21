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
  width: 100%;
  height: 100%;
  background-color: #f4f4f9;
`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const fetchTasks = async () => {
      try {
        const response = await fetch("http://192.168.106.101:8000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        const updatedTasks = data.map(task => ({
          ...task,
          completed: task.status === 2,
          dueDate: task.assigned_date
        }));
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    const task = {
      id: Date.now(),
      text: newTask.text,
      description: newTask.description,
      quadrant: newTask.quadrant,
      completed: false,
      dueDate: newTask.dueDate,
      timer: 0, // Initialize timer to 0
      isRunning: false,
    };
  
    // Add the task to the local state
    setTasks([...tasks, task]);
  
    // Make an API call to store the task in the database
    try {
      const response = await fetch("http://192.168.106.101:8000/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.text,
          description: task.description,
          priority: task.quadrant,
          assigned_date: task.dueDate,
          assignee: 2, // Assuming assignee is a fixed value for now
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
  
      const savedTask = await response.json();
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
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

  const setTaskDueDate = async (taskId, dueDate) => {
    try {
      const response = await fetch(`http://192.168.106.101:8000/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assigned_date: dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task due date");
      }
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, dueDate } : task)));
    }
    catch (error) {
      console.error("Error updating task due date:", error);
    }
    
  };

  const toggleTaskCompletion = async (taskId) => {
    try{
      const task = tasks.find((task) => task.id === taskId);
      const newStatus = task.completed ? 1 : 2;
      const response = await fetch(`http://192.168.106.101:8000/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      console.log(response);
      
      if(!response.ok){
        throw new Error("Failed to toggle task completion");
      }
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: updatedTask.status === 2 } : task)));
    }
    catch(error){
      console.error("Error toggling task completion:", error);
    }
  };

  const deleteTask = async (taskId) => {

    try{
      const response = await fetch(`http://192.168.106.101:8000/task/${taskId}`, {method: "DELETE"});

      if(!response.ok){
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch(error) {
      console.error("Error deleting task:", error);
    }
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