import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionsAPI, coursesAPI, enrollmentsAPI } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalCourses: 0,
        totalEnrolled: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const questions = await questionsAPI.getAll();
                const courses = await coursesAPI.getAll();
                const enrollments = await enrollmentsAPI.getAll();
                setStats({
                    totalQuestions: questions.count || 0,
                    totalCourses: courses.count || 0,
                    totalEnrolled: enrollments.count || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-container">
            <h2 className="admin-header-title">Admin Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h1 className="stat-number" style={{ color: '#1a237e' }}>{stats.totalQuestions}</h1>
                    <p className="stat-label">Total Questions</p>
                    <Link to="/admin/questions" className="btn-primary">
                        Manage Questions
                    </Link>
                </div>
                <div className="stat-card">
                    <h1 className="stat-number" style={{ color: '#ffab00' }}>{stats.totalCourses}</h1>
                    <p className="stat-label">Total Courses</p>
                    <button className="btn-primary btn-disabled" disabled>
                        Manage Courses
                    </button>
                </div>
                <div className="stat-card">
                    <h1 className="stat-number" style={{ color: '#4caf50' }}>{stats.totalEnrolled}</h1>
                    <p className="stat-label">Student Enrollments</p>
                    <Link to="/admin/enrollments" className="btn-primary">
                        Manage Enrollments
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
