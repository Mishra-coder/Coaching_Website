import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionsAPI, coursesAPI, enrollmentsAPI } from '../../services/api';
import '../../index.css';

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

    const cardStyle = {
        background: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        textAlign: 'center',
        flex: '1',
        minWidth: '200px'
    };

    return (
        <div style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '30px', color: '#1a237e' }}>Admin Dashboard</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <h1 style={{ fontSize: '3rem', color: '#1a237e', marginBottom: '10px' }}>{stats.totalQuestions}</h1>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Total Questions</p>
                    <Link to="/admin/questions" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Manage Questions
                    </Link>
                </div>
                <div style={cardStyle}>
                    <h1 style={{ fontSize: '3rem', color: '#ffab00', marginBottom: '10px' }}>{stats.totalCourses}</h1>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Total Courses</p>
                    <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', opacity: 0.7, cursor: 'not-allowed' }}>
                        Manage Courses
                    </button>
                </div>
                <div style={cardStyle}>
                    <h1 style={{ fontSize: '3rem', color: '#4caf50', marginBottom: '10px' }}>{stats.totalEnrolled}</h1>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Student Enrollments</p>
                    <Link to="/admin/enrollments" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Manage Enrollments
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
