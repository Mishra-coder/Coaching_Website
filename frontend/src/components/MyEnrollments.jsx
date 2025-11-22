import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { enrollmentsAPI } from '../services/api';
import { Link } from 'react-router-dom';

const MyEnrollments = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchEnrollments();
        }
    }, [user]);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const data = await enrollmentsAPI.getUserEnrollments(user.id);
            setEnrollments(data.enrollments);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="fade-in">
            <h2 style={{ color: '#1a237e', fontWeight: '700', marginBottom: '10px' }}>My Enrollments</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Track your active courses</p>

            {enrollments.length === 0 ? (
                <div className="text-center p-5" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #eee' }}>
                    <i className="fas fa-book-open" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
                    <h5>No enrollments found</h5>
                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                    <Link to="/enroll" className="btn-primary mt-3">Browse Courses</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {enrollments.map((enrollment) => (
                        <div className="col-md-6" key={enrollment._id}>
                            <div style={{
                                padding: '25px',
                                borderRadius: '15px',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.3s ease',
                                background: '#fff'
                            }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className="badge" style={{
                                        background: enrollment.status === 'active' ? '#dcfce7' : '#fff7ed',
                                        color: enrollment.status === 'active' ? '#166534' : '#9a3412',
                                        padding: '8px 12px',
                                        borderRadius: '8px'
                                    }}>
                                        {enrollment.status.toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {new Date(enrollment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h5 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '15px' }}>
                                    {enrollment.course?.title}
                                </h5>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEnrollments;
