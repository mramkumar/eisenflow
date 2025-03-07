import React from "react";
import styled from "styled-components";
import Quadrant from "./Quadrant";
import { PlusCircle, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MatrixTableContainer = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
  margin-top: -20px;
  margin-bottom: -10px;
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

const CalendarIcon = styled(Calendar)`
  cursor: pointer;
  color: #2196f3;
  font-size: 2rem;
`;

const CustomDateInput = ({ value, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
    <CalendarIcon size={32} style={{ marginBottom: '-70px', marginLeft: '50px' }} />
    <span style={{ 
      visibility: 'hidden', 
      position: 'absolute', 
      color: '#2196f3', 
      backgroundColor: '#fff', 
      borderRadius: '4px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
    }}>
      {value}
    </span>
  </div>
);

const StyledDatePicker = styled(DatePicker)`
  .react-datepicker-wrapper {
    display: flex;
    align-items: center;
  }

  .react-datepicker__input-container {
    display: flex;
    align-items: center;
  }

  .react-datepicker__input-container input {
    border: none;
    background: transparent;
    font-size: 2rem;
    color: #2196f3;
    cursor: pointer;
  }

  .react-datepicker {
    font-size: 1rem;
  }

  .react-datepicker__header {
    background-color: #2196f3;
    color: #fff;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #2196f3;
    color: #fff;
  }

  .react-datepicker__input-container:hover span {
    visibility: visible;
  }
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
  dateRange,
  setDateRange,
}) {
  const [startDate, endDate] = dateRange;

  return (
    <MatrixTableContainer>
      <MatrixColGroup />
      <thead>
        <tr>
          <th colSpan="3" className="matrix-title">
            <HeaderContainer>
              <div>EisenFlow</div>
              <RightHeaderContainer>
                <StyledDatePicker
                  selected={startDate}
                  onChange={(update) => setDateRange(update)}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a date range"
                  customInput={<CustomDateInput value={`${startDate ? startDate.toLocaleDateString() : ''} - ${endDate ? endDate.toLocaleDateString() : ''}`} />}
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

export default MatrixTable;