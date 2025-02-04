import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PlusCircle, CheckCircle, Circle, Trash2, Play, StopCircle, Edit3 } from "lucide-react";
import styled from "styled-components";
import "./App.css";
import TaskPopup from "./components/TaskPopup";
import EditTaskPopup from "./components/EditTaskPopup";
import ViewTaskPopup from "./components/ViewTaskPopup";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f4f4f9;
`;

const MatrixTable = styled.table`
  width: 100%;
  height: 100vh;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
`;

const MatrixColGroup = () => (
  <colgroup>
    <col style={{ width: "45px" }} />
    <col />
    <col />
  </colgroup>
);

const QuadrantCell = styled.td`
  background-color: ${({ isOver }) => (isOver ? "#e0f7fa" : "#fafafa")};
  transition: background-color 0.3s ease;
  height: calc(50vh - 60px);
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #ddd;
  width: 50%;
`;

const TaskListContainer = styled.div`
  min-height: 100px;
  max-height: calc(50vh - 120px);
  overflow-y: auto;
`;

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

const TaskTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TaskText = styled.span`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TaskDescription = styled.p`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  padding: 0;
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

const AddTaskIcon = styled.span`
  cursor: pointer;
  color: #2196f3;
  font-size: 2rem;
  position: absolute;
  top: 20px;
  right: 20px;
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
        <MatrixTable>
          <MatrixColGroup />
          <thead>
            <tr>
              <th colSpan="3" className="matrix-title">
                EisenFlow
                <AddTaskIcon onClick={() => setShowPopup(true)}>
                  <PlusCircle size={32} />
                </AddTaskIcon>
              </th>
            </tr>
            <tr>
              <th></th>
              <th className="urgent-header">Urgent</th>
              <th className="not-urgent-header">Not Urgent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="important-header">Important</th>
              <Quadrant
                quadrant={1}
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
              />
              <Quadrant
                quadrant={2}
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
              />
            </tr>
            <tr>
              <th className="not-important-header">Not Important</th>
              <Quadrant
                quadrant={3}
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
              />
              <Quadrant
                quadrant={4}
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
              />
            </tr>
          </tbody>
        </MatrixTable>
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

  return (
    <QuadrantCell ref={drop} isOver={isOver}>
      <TaskList
        quadrant={quadrant}
        tasks={tasks}
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
    <TaskItem
      ref={(node) => drag(drop(node))}
      isDragging={isDragging}
      completed={task.completed}
      onClick={() => { setCurrentTask(task); setShowViewPopup(true); }}
    >
      <TaskContent>
        <TaskCheckbox onClick={() => toggleTaskCompletion(task.id)}>
          {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
        </TaskCheckbox>
        <TaskTextContainer>
          <TaskText>{task.text}</TaskText>
          <TaskDescription>{task.description}</TaskDescription>
        </TaskTextContainer>
        <TaskIconContainer>
          <TaskTimer>
            {formatTime(task.timer)}
            <TaskIcon hoverColor="#2196f3" onClick={() => toggleTaskTimer(task.id)}>
              {task.isRunning ? <StopCircle size={16} /> : <Play size={16} />}
            </TaskIcon>
          </TaskTimer>
          <TaskIcon hoverColor="#ff9800" onClick={() => { setCurrentTask(task); setShowEditPopup(true); }}>
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
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

export default App;