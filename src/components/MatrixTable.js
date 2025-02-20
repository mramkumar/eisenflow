import React, { useState } from "react";
import styled from "styled-components";
import Quadrant from "./Quadrant";
import { PlusCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MatrixTableContainer = styled.table`
  width: 100%;
  height: 100%;
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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
`;

const RightHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddTaskIcon = styled.span`
  cursor: pointer;
  color: #2196f3;
  font-size: 2rem;
`;


function MatrixTable({
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
  setShowPopup,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <MatrixTableContainer>
      <MatrixColGroup />
      <thead>
        <tr>
          <th colSpan="3" className="matrix-title">
            <HeaderContainer>
              <div>EisenFlow</div>
              <RightHeaderContainer>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  customInput={<CustomDateInput />}
                />
                <AddTaskIcon onClick={() => setShowPopup(true)}>
                  <PlusCircle size={32} />
                </AddTaskIcon>
              </RightHeaderContainer>
            </HeaderContainer>
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
    </MatrixTableContainer>
  );
}

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="custom-date-input" onClick={onClick} ref={ref}>
    {value}
  </button>
));

export default MatrixTable;