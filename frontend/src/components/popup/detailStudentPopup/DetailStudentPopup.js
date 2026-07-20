import React, { useState } from 'react';
import axios from 'axios';
import './DetailStudentPopup.css';
import config from '../../../config/config';

const DetailStudentPopup = ({ student, isAdmin, onClose, onUpdate, onDelete }) => {
  // State to manage edit mode and edited student data
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState({ ...student });
  const baseUrl = config.baseUrl; // Base URL for API requests

  // Function to handle updating student data
  const handleUpdate = async () => {
    try {
      // Data of the student to be updated
      const updatedStudentData = {
        firstName: editedStudent.firstName,
        lastName: editedStudent.lastName,
        email: editedStudent.email,
        password: editedStudent.password,
        birthDay: editedStudent.birthDay,
      };

      // Sending update request using Axios
      const response = await axios.post(
        `${baseUrl}/users/update/${student.studentID}`, // Add API URL here
        updatedStudentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Adding JWT token
          }
        }
      );

      // Sending updated data to the parent component and exiting edit mode
      onUpdate(response.data);
      setIsEditMode(false);
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

  // Function to handle student deletion
  const handleDelete = async () => {
    try {
      // Sending delete request using Axios
      await axios.delete(
        `${baseUrl}/users/${student.studentID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Adding JWT token
          }
        }
      );

      // Sending deleted student info to the parent component and closing the popup
      onDelete(student.studentID);
      onClose();
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        {!isEditMode && (
          <div>
            {/* Displaying student info */}
            <h2>{student.firstName} {student.lastName}</h2>
            <p>Email: {student.email}</p>
            <p>Birth Date: {student.birthDay}</p>
            <p>Student ID: {student.studentID}</p>
          </div>
        )}
        {(isAdmin === true || isAdmin === "true") && !isEditMode && (
          <div className="button-group">
            {/* Buttons for edit and delete options */}
            <button onClick={() => setIsEditMode(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
        {isEditMode && (
          <div>
            {/* Inputs for editing student data */}
            <input
              type="text"
              name='firstName'
              value={editedStudent.firstName}
              onChange={(e) => setEditedStudent({ ...editedStudent, firstName: e.target.value })}
            />
            <input
              type="text"
              name="lastName"
              value={editedStudent.lastName}
              onChange={(e) => setEditedStudent({ ...editedStudent, lastName: e.target.value })}
            />
            <input type="email" name="email" value={editedStudent.email}
              onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
            />
            <input type="text" name="password" value={editedStudent.password}
              onChange={(e) => setEditedStudent({ ...editedStudent, password: e.target.value })}
            />
            <input type="date" name="birthDay" value={editedStudent.birthDay}
              onChange={(e) => setEditedStudent({ ...editedStudent, birthDay: e.target.value })}
            />
            <div className="button-group">
              {/* Buttons for saving changes and canceling edit mode */}
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setIsEditMode(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailStudentPopup;
