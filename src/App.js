import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import "./App.css";
import TaskManager from "./components/TaskManager";
import Login from "./components/Login";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f4f4f9;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setIsAuthenticated(true);
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failed:", response);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        {isAuthenticated ? (
          <TaskManager />
        ) : (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onLoginFailure={handleLoginFailure}
          />
        )}
      </AppContainer>
    </DndProvider>
  );
}

export default App;