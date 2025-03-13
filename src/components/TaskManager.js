import React, { useState, useEffect, useRef } from "react";
import TaskPopup from "./TaskPopup";
import EditTaskPopup from "./EditTaskPopup";
import ViewTaskPopup from "./ViewTaskPopup";
import MatrixTable from "./MatrixTable";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from './config';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [quadrantNames, setQuadrantNames] = useState([]);
  const [shouldFetchTasks, setShouldFetchTasks] = useState(false);

  useEffect(() => {
    const fetchQuadrantNames = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/quadrants`);
        if (!response.ok) {
          throw new Error('Failed to fetch quadrant names');
        }
        const data = await response.json();
        setQuadrantNames(data);
      } catch (error) {
        console.error('Error fetching quadrant names:', error);
      }
    };

    fetchQuadrantNames();
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const tasksRef = useRef(tasks);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const fetchTasks = async () => {
    const [startDate, endDate] = dateRange;
    if (!startDate || !endDate) return;

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks?start_date=${start}&end_date=${end}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      
      const data = await response.json();

      const updatedTasks = data.map(task => ({
        ...task,
        completed: task.status === 2,
        dueDate: task.assigned_date,
        quadrant: task.priority,
        timer: task.duration || 0, // Initialize timer from duration or set to 0 if undefined
        isRunning: false // Ensure isRunning is initialized to false if not present
      }));

      updatedTasks.sort((a, b) => a.completed - b.completed);
      setTasks(updatedTasks);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [dateRange, shouldFetchTasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTime = Math.floor((now - lastUpdateTimeRef.current) / 1000);
      lastUpdateTimeRef.current = now;

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.isRunning) {
            const updatedTimer = task.timer + elapsedTime; // Increment timer by elapsed time
            return { ...task, timer: updatedTimer };
          }
          return task;
        })
      );
    }, 1000); // Update every second

    const saveInterval = setInterval(() => {
      tasksRef.current.forEach((task) => {
        if (task.isRunning) {
          updateTaskDuration(task.id, task.timer); // Save the timer value every 1 minute
        }
      });
    }, 60000); // Save to database every 1 minute (60 seconds)
  
    return () => {
      clearInterval(interval);
      clearInterval(saveInterval);
    };
  }, []);

  const updateTaskDuration = async (taskId, duration) => {
    try {
      await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ duration }),
      });
    } catch (error) {
      console.error("Error updating task duration:", error);
    }
  };

  const addTask = async (newTask) => {
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      quadrant: newTask.quadrant,
      completed: false,
      dueDate: newTask.dueDate,
      timer: 0, // Initialize timer to 0
      isRunning: false,
    };

    setTasks([...tasks, task]);
  
    try {
      const response = await fetch(`${API_BASE_URL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
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
  
  const updateTask = async (updatedTask) => {
    const task = tasks.find((task) => task.id === updatedTask.id );
    const changes = {};

    if ( task.title !== updatedTask.title ) changes.title = updatedTask.title;
    if ( task.description !== updatedTask.description) changes.description = updatedTask.description;
    if (task.quadrant !== updatedTask.quadrant) changes.priority = updatedTask.quadrant;
    if (task.dueDate !== updatedTask.dueDate) changes.assigned_date = updatedTask.dueDate;
    if (task.completed !== updatedTask.completed) changes.status = updatedTask.completed ? 2 : 1;
    
    try {
      const response = await fetch(`${API_BASE_URL}/task/${updatedTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      await response.json();
      setShouldFetchTasks(true); // Trigger fetchTasks to refresh the page
      setShowEditPopup(false);
      setShowViewPopup(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const moveTask = async (taskId, newQuadrant) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: newQuadrant, // Update the priority column in the database
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task priority");
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, quadrant: newQuadrant } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
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
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
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
      fetchTasks();
    }
    catch (error) {
      console.error("Error updating task due date:", error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      const newStatus = task.completed ? 1 : 2;
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle task completion");
      }
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: updatedTask.status === 2 } : task)));
      fetchTasks();
    }
    catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}:8000/task/${taskId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskTimer = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const isRunning = !task.isRunning;
          if (!isRunning) {
            updateTaskDuration(task.id, task.timer);
          }
          return { ...task, isRunning };
        }
        return { ...task, isRunning: false };
      })
    );
  };

  return (
    <>
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
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <TaskPopup 
        showPopup={showPopup} 
        setShowPopup={setShowPopup} 
        addTask={addTask}
        quadrantNames={quadrantNames} />
      {currentTask && (
        <>
          <EditTaskPopup
            showPopup={showEditPopup}
            setShowPopup={setShowEditPopup}
            task={currentTask}
            updateTask={updateTask}
            quadrantNames={quadrantNames}
          />
          <ViewTaskPopup
            showPopup={showViewPopup}
            setShowPopup={setShowViewPopup}
            task={currentTask}
            updateTask={updateTask}
            quadrantNames={quadrantNames}
          />
        </>
      )}
    </>
  );
};

export default TaskManager;