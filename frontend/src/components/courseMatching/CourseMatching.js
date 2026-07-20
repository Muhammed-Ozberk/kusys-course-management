import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourseMatching.css';
import config from '../../config/config';

function CourseMatching({ isAdmin, onClose, onMatch }) {
    // State to track selected student and course for matching
    const [selectedStudentForMatching, setSelectedStudentForMatching] = useState('');
    const [selectedCourseForMatching, setSelectedCourseForMatching] = useState('');

    // State to store lists of students and courses
    const [students, setStudents] = useState([{ studentID: '', firstName: '' }]);
    const [courses, setCourses] = useState([{ courseID: '', courseName: '' }]);

    const baseUrl = config.baseUrl; // Base URL for API requests

    // Get JWT token from local storage
    const jwtToken = localStorage.getItem('authToken'); 

    useEffect(() => {
        if (jwtToken) {
            const headers = {
                Authorization: `Bearer ${jwtToken}` 
            };

            // Fetch data from the API
            if (isAdmin === true || isAdmin === "true") {
                // Fetch list of students if user is admin
                axios.get(`${baseUrl}/users`, { headers })
                    .then(response => {
                        setStudents(response.data.data);
                    })
                    .catch(error => {
                        console.error('Error fetching student data:', error);
                    });
            } else {
                // Fetch the single student's data if not admin
                axios.get(`${baseUrl}/users/${localStorage.getItem("userID")}`, { headers })
                    .then(response => {
                        setStudents([response.data.data]);
                    })
                    .catch(error => {
                        console.error('Error fetching student data:', error);
                    });
            }
            // Fetch list of courses
            axios.get(`${baseUrl}/courses`, { headers })
                .then(response => {
                    setCourses(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching course data:', error);
                });
        }
    }, [jwtToken, isAdmin, baseUrl]);

    // Handle the match button click
    const handleMatchClick = () => {
        if (selectedStudentForMatching && selectedCourseForMatching) {
            console.log(`Matched student ${selectedStudentForMatching} with course ${selectedCourseForMatching}`);
            const [studentID, firstName] = selectedStudentForMatching.split('+');
            const [courseID, courseName] = selectedCourseForMatching.split('+');
            
            // Send POST request to match student with course
            axios.post(`${baseUrl}/courses/create`, {
                studentID: studentID,
                firstName: firstName,
                courseID: courseID,
                courseName: courseName,
            }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}` 
                }
            }).then(response => {
                onMatch(); // Notify parent component about the match
                console.log(response);
            }).catch(error => {
                onMatch(); // Notify parent component about the match (even in case of error)
                console.error('Error matching student and course:', error);
            });
        }
    };

    return (
        <div className="popup-overlay">
            <div className="matching-popup">
                <h2>Match Student with Course</h2>
                <select
                    value={selectedStudentForMatching}
                    onChange={(e) => setSelectedStudentForMatching(e.target.value)}
                >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                        <option key={student.studentID} value={`${student.studentID}+${student.firstName}`}>
                            {student.firstName} {student.lastName}
                        </option>
                    ))}
                </select>
                {isAdmin && (
                    <select
                        value={selectedCourseForMatching}
                        onChange={(e) => setSelectedCourseForMatching(e.target.value)}
                    >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.courseID} value={`${course.courseID}+${course.courseName}`}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                )}
                <button onClick={handleMatchClick}>Match</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default CourseMatching;
