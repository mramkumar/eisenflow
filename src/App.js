import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import "./App.css";
import TaskManager from "./components/TaskManager";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f4f4f9;
`;

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <TaskManager />
      </AppContainer>
    </DndProvider>
  );
}

export default App;