import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PlusCircle, CheckCircle, Circle, Trash2, Play, StopCircle } from "lucide-react";
import styled from "styled-components";
import "./App.css";

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
`;

const TaskInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TaskInputField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
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
`;

const TaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TaskCheckbox = styled.span`
  cursor: pointer;
  color: #64b5f6;
`;

const TaskText = styled.span`
  flex: 1;
  text-align: left;
`;

const TaskTimer = styled.span`
  font-size: 0.9rem;
  color: #555;
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

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInputs, setTaskInputs] = useState({ 1: "", 2: "", 3: "", 4: "" });

  const addTask = (quadrant) => {
    if (!taskInputs[quadrant].trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskInputs[quadrant],
      quadrant,
      completed: false,
      dueDate: null,
      timer: 0,
      isRunning: false,
    };
    setTasks([...tasks, newTask]);
    setTaskInputs({ ...taskInputs, [quadrant]: "" });
  };

  const moveTask = (taskId, newQuadrant) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, quadrant: newQuadrant } : task)));
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
                Eisenhower Matrix
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
                addTask={addTask}
                moveTask={moveTask}
                setTaskDueDate={setTaskDueDate}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                toggleTaskTimer={toggleTaskTimer}
                taskInputs={taskInputs}
                setTaskInputs={setTaskInputs}
              />
              <Quadrant
                quadrant={2}
                tasks={tasks}
                addTask={addTask}
                moveTask={moveTask}
                setTaskDueDate={setTaskDueDate}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                toggleTaskTimer={toggleTaskTimer}
                taskInputs={taskInputs}
                setTaskInputs={setTaskInputs}
              />
            </tr>
            <tr>
              <th className="not-important-header">Not Important</th>
              <Quadrant
                quadrant={3}
                tasks={tasks}
                addTask={addTask}
                moveTask={moveTask}
                setTaskDueDate={setTaskDueDate}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                toggleTaskTimer={toggleTaskTimer}
                taskInputs={taskInputs}
                setTaskInputs={setTaskInputs}
              />
              <Quadrant
                quadrant={4}
                tasks={tasks}
                addTask={addTask}
                moveTask={moveTask}
                setTaskDueDate={setTaskDueDate}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
                toggleTaskTimer={toggleTaskTimer}
                taskInputs={taskInputs}
                setTaskInputs={setTaskInputs}
              />
            </tr>
          </tbody>
        </MatrixTable>
      </AppContainer>
    </DndProvider>
  );
}

function Quadrant({
  quadrant,
  tasks,
  addTask,
  moveTask,
  setTaskDueDate,
  toggleTaskCompletion,
  deleteTask,
  toggleTaskTimer,
  taskInputs,
  setTaskInputs,
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, quadrant),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const handleInputChange = (quadrant, value) => {
    setTaskInputs({ ...taskInputs, [quadrant]: value });
  };

  return (
    <QuadrantCell ref={drop} isOver={isOver}>
      <TaskInput>
        <TaskInputField
          type="text"
          placeholder="Enter Task"
          value={taskInputs[quadrant]}
          onChange={(e) => handleInputChange(quadrant, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask(quadrant)}
        />
        <TaskIcon hoverColor="#2196f3" onClick={() => addTask(quadrant)}>
          <PlusCircle size={16} />
        </TaskIcon>
      </TaskInput>
      <TaskList
        quadrant={quadrant}
        tasks={tasks}
        setTaskDueDate={setTaskDueDate}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        toggleTaskTimer={toggleTaskTimer}
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
}) {
  const quadrantTasks = tasks.filter((task) => task.quadrant === quadrant);

  return (
    <TaskListContainer>
      {quadrantTasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          setTaskDueDate={setTaskDueDate}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          toggleTaskTimer={toggleTaskTimer}
        />
      ))}
    </TaskListContainer>
  );
}

function Task({
  task,
  setTaskDueDate,
  toggleTaskCompletion,
  deleteTask,
  toggleTaskTimer,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <TaskItem
      ref={drag}
      isDragging={isDragging}
      completed={task.completed}
    >
      <TaskContent>
        <TaskCheckbox onClick={() => toggleTaskCompletion(task.id)}>
          {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
        </TaskCheckbox>
        <TaskText>{task.text}</TaskText>
        <TaskTimer>{formatTime(task.timer)}</TaskTimer>
        <TaskIcon hoverColor="#2196f3" onClick={() => toggleTaskTimer(task.id)}>
          {task.isRunning ? <StopCircle size={16} /> : <Play size={16} />}
        </TaskIcon>
        <TaskIcon hoverColor="#d32f2f" onClick={() => deleteTask(task.id)}>
          <Trash2 size={16} />
        </TaskIcon>
      </TaskContent>
      <TaskDueDate
        type="date"
        onChange={(e) => setTaskDueDate(task.id, e.target.value)}
      />
    </TaskItem>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

export default App;