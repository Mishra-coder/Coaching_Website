import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, enrollmentsAPI } from '../services/api';
import { Link } from 'react-router-dom';
const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedEnrollmentDetail, setSelectedEnrollmentDetail] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
            fetchData();
        }
    }, [user]);
    const fetchData = async () => {
        try {
            setLoading(true);
            const enrollData = await enrollmentsAPI.getUserEnrollments(user.id);
            setEnrollments(enrollData.enrollments);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await authAPI.updateProfile(formData);
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        }
    };
    const getNextSunday = () => {
        const date = new Date();
        date.setDate(date.getDate() + (7 - date.getDay()) % 7);
        return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
    const cardStyle = {
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
    };
    const sidebarLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        margin: '5px 0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isActive ? 'linear-gradient(45deg, #1a237e, #3949ab)' : 'transparent',
        color: isActive ? '#fff' : '#64748b',
        fontWeight: isActive ? '600' : '500',
        border: 'none',
        width: '100%',
        textAlign: 'left'
    });
    return (
        <div className="profile-page" style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-3">
                        <div style={cardStyle}>
                            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(26, 35, 126, 0.05) 0%, rgba(255,255,255,0) 100%)' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(45deg, #1a237e, #ffab00)',
                                    padding: '3px',
                                    margin: '0 auto 20px'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        background: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold',
                                        color: '#1a237e'
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <h4 style={{ fontWeight: '700', marginBottom: '5px', color: '#1a237e' }}>{user?.name}</h4>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.email}</p>
                                <div style={{ marginTop: '15px' }}>
                                    <span className="badge" style={{ background: '#e3f2fd', color: '#1a237e', padding: '8px 15px', borderRadius: '20px' }}>
                                        {user?.role === 'admin' ? 'Administrator' : 'Student'}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '20px', paddingTop: '40px' }}>
                                <button style={sidebarLinkStyle(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>
                                    <i className="fas fa-user me-3"></i> Profile Details
                                </button>
                                <button style={sidebarLinkStyle(activeTab === 'enrollments')} onClick={() => setActiveTab('enrollments')}>
                                    <i className="fas fa-graduation-cap me-3"></i> My Enrollments
                                </button>
                                <button style={{ ...sidebarLinkStyle(activeTab === 'schedule'), marginTop: '20px' }} onClick={() => setActiveTab('schedule')}>
                                    <i className="fas fa-calendar-alt me-3"></i> Test Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div style={{ ...cardStyle, padding: '40px', minHeight: '600px' }}>
                            {activeTab === 'profile' && (
                                <div className="fade-in">
                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                        <div>
                                            <h2 style={{ color: '#1a237e', fontWeight: '700', marginBottom: '10px' }}>Personal Information</h2>
                                            <p style={{ color: '#64748b' }}>Manage your personal details and preferences</p>
                                        </div>
                                        {!editMode && (
                                            <button
                                                className="btn-primary"
                                                onClick={() => setEditMode(true)}
                                                style={{ padding: '10px 25px', fontSize: '0.9rem' }}
                                            >
                                                <i className="fas fa-edit me-2"></i> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                    {editMode ? (
                                        <form onSubmit={handleUpdateProfile} style={{ maxWidth: '600px' }}>
                                            <div className="mb-4">
                                                <label className="form-label" style={{ fontWeight: '600', color: '#1e293b' }}>Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label" style={{ fontWeight: '600', color: '#1e293b' }}>Phone Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label" style={{ fontWeight: '600', color: '#1e293b' }}>Address</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                                ></textarea>
                                            </div>
                                            <div className="d-flex gap-3">
                                                <button type="submit" className="btn-primary">Save Changes</button>
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => setEditMode(false)}
                                                    style={{ background: '#f1f5f9', border: 'none', color: '#64748b' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <div style={{ padding: '25px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                                        <i className="fas fa-user" style={{ color: '#1a237e', fontSize: '1.2rem', marginRight: '10px' }}></i>
                                                        <label style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: '500' }}>Full Name</label>
                                                    </div>
                                                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>{user?.name}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div style={{ padding: '25px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                                        <i className="fas fa-envelope" style={{ color: '#1a237e', fontSize: '1.2rem', marginRight: '10px' }}></i>
                                                        <label style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: '500' }}>Email Address</label>
                                                    </div>
                                                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0, wordBreak: 'break-word' }}>{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div style={{ padding: '25px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                                        <i className="fas fa-phone" style={{ color: '#1a237e', fontSize: '1.2rem', marginRight: '10px' }}></i>
                                                        <label style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: '500' }}>Phone Number</label>
                                                    </div>
                                                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>{user?.phone || 'Not set'}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div style={{ padding: '25px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                                        <i className="fas fa-map-marker-alt" style={{ color: '#1a237e', fontSize: '1.2rem', marginRight: '10px' }}></i>
                                                        <label style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: '500' }}>Address</label>
                                                    </div>
                                                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>{user?.address || 'Not set'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'enrollments' && (
                                <div className="fade-in">
                                    <h2 style={{ color: '#1a237e', fontWeight: '700', marginBottom: '10px' }}>My Enrollments</h2>
                                    <p style={{ color: '#64748b', marginBottom: '30px' }}>Track your active courses and payment status</p>
                                    {enrollments.length === 0 ? (
                                        <div className="text-center p-5" style={{ background: '#f8fafc', borderRadius: '20px' }}>
                                            <i className="fas fa-book-open" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
                                            <h5>No enrollments found</h5>
                                            <p className="text-muted">You haven't enrolled in any courses yet.</p>
                                            <Link to="/enroll" className="btn-primary mt-3">Browse Courses</Link>
                                        </div>
                                    ) : (
                                        <div className="row" style={{ gap: '30px 0' }}>
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
                                                            {enrollment.course?.title || 'Admission Form'}
                                                        </h5>
                                                        <button
                                                            onClick={() => setSelectedEnrollmentDetail(enrollment)}
                                                            className="btn-primary"
                                                            style={{ padding: '8px 15px', fontSize: '0.85rem', borderRadius: '8px', width: '100%' }}
                                                        >
                                                            View Form Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Enrollment Detail Modal */}
                                    {selectedEnrollmentDetail && (
                                        <div style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 1000,
                                            padding: '20px'
                                        }}>
                                            <div style={{
                                                background: '#fff',
                                                width: '100%',
                                                maxWidth: '700px',
                                                maxHeight: '90vh',
                                                borderRadius: '20px',
                                                overflowY: 'auto',
                                                position: 'relative',
                                                padding: '40px'
                                            }}>
                                                <button
                                                    onClick={() => setSelectedEnrollmentDetail(null)}
                                                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}
                                                >
                                                    ×
                                                </button>

                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <h3 style={{ color: '#1a237e', fontWeight: '700', margin: 0 }}>My Admission Form</h3>
                                                    <button
                                                        onClick={() => window.print()}
                                                        className="btn-outline"
                                                        style={{ padding: '5px 15px', borderRadius: '8px', fontSize: '0.8rem' }}
                                                    >
                                                        <i className="fas fa-print me-2"></i> Print
                                                    </button>
                                                </div>

                                                <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                                    <div style={{ width: '150px', height: '180px', borderRadius: '15px', background: '#f8fafc', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                                        {selectedEnrollmentDetail.photo ? (
                                                            <img src={selectedEnrollmentDetail.photo} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                                <i className="fas fa-user-circle fa-4x"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="mb-3">
                                                            <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Student Name</label>
                                                            <h4 style={{ color: '#1a237e', fontWeight: '700', margin: 0 }}>{selectedEnrollmentDetail.studentName}</h4>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-6 mb-3">
                                                                <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Status</label>
                                                                <div>
                                                                    <span className="badge" style={{ background: selectedEnrollmentDetail.status === 'active' ? '#dcfce7' : '#fff7ed', color: selectedEnrollmentDetail.status === 'active' ? '#166534' : '#9a3412', borderRadius: '8px' }}>
                                                                        {selectedEnrollmentDetail.status.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 mb-3">
                                                                <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Enrollment Date</label>
                                                                <p style={{ fontWeight: '600', margin: 0 }}>{new Date(selectedEnrollmentDetail.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row g-4">
                                                    <div className="col-md-6">
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Father's Name</label>
                                                        <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>{selectedEnrollmentDetail.fatherName}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Mother's Name</label>
                                                        <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>{selectedEnrollmentDetail.motherName}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Date of Birth</label>
                                                        <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>{selectedEnrollmentDetail.dateOfBirth.day}/{selectedEnrollmentDetail.dateOfBirth.month}/{selectedEnrollmentDetail.dateOfBirth.year}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Gender</label>
                                                        <p style={{ fontWeight: '600', color: '#1e293b', textTransform: 'capitalize', margin: 0 }}>{selectedEnrollmentDetail.gender}</p>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Aadhar Number</label>
                                                        <p style={{ fontWeight: '600', color: '#1e293b', letterSpacing: '2px', margin: 0 }}>{selectedEnrollmentDetail.aadharNumber}</p>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Full Address</label>
                                                        <p style={{ fontWeight: '600', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>{selectedEnrollmentDetail.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'schedule' && (
                                <div className="fade-in">
                                    <h2 style={{ color: '#1a237e', fontWeight: '700', marginBottom: '10px' }}>Weekly Test Schedule</h2>
                                    <p style={{ color: '#64748b', marginBottom: '30px' }}>Stay prepared for upcoming assessments</p>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                                        borderRadius: '20px',
                                        padding: '40px',
                                        color: '#fff',
                                        marginBottom: '40px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <h5 style={{ opacity: 0.9, marginBottom: '10px' }}>Next Scheduled Test</h5>
                                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>{getNextSunday()}</h1>
                                            <p style={{ opacity: 0.8 }}>Every Sunday is Test Day! Prepare well.</p>
                                        </div>
                                        <i className="fas fa-clock" style={{
                                            position: 'absolute',
                                            right: '-20px',
                                            bottom: '-20px',
                                            fontSize: '10rem',
                                            opacity: 0.1
                                        }}></i>
                                    </div>
                                    <h4 style={{ color: '#1e293b', marginBottom: '20px' }}>Upcoming Sessions</h4>
                                    <div className="list-group">
                                        {[
                                            { subject: 'Mathematics - Algebra', class: 'Class 10th & 12th', time: '10:00 AM', color: '#3b82f6' },
                                            { subject: 'Physics - Mechanics', class: 'Class 12th', time: '02:00 PM', color: '#8b5cf6' },
                                            { subject: 'Science - Chemical Reactions', class: 'Class 10th', time: '04:00 PM', color: '#10b981' }
                                        ].map((test, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '20px',
                                                background: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '12px',
                                                marginBottom: '15px'
                                            }}>
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    background: `${test.color}20`,
                                                    color: test.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    marginRight: '20px'
                                                }}>
                                                    <i className="fas fa-book"></i>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h6 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{test.subject}</h6>
                                                    <small style={{ color: '#64748b' }}>{test.class}</small>
                                                </div>
                                                <span className="badge" style={{ background: '#f1f5f9', color: '#1e293b', padding: '10px 15px', borderRadius: '30px' }}>
                                                    {test.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;