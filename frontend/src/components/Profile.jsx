import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, enrollmentsAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [view, setView] = useState('profile');
    const [myCourses, setMyCourses] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);

    const [profileData, setProfileData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || ''
            });
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        try {
            setIsFetching(true);
            const data = await enrollmentsAPI.getUserEnrollments(user.id);
            setMyCourses(data.enrollments);
        } catch (err) {
            console.error('Failed to load profile data:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const onProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await authAPI.updateProfile(profileData);
            if (res.success) {
                updateUser(res.user);
            }
            setIsEditing(false);
            alert('Profile updated!');
        } catch (err) {
            alert('Update failed');
        }
    };

    const nextTestDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + (7 - date.getDay()) % 7);
        return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isFetching) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        </div>
    );

    return (
        <div className="profile-page">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-3">
                        <div className="profile-card">
                            <div className="profile-sidebar-header">
                                <div className="profile-avatar-wrapper">
                                    <div className="profile-avatar-inner">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <h4 className="profile-user-name">{user?.name}</h4>
                                <p className="profile-user-email">{user?.email}</p>
                            </div>

                            <div className="profile-nav-menu">
                                <button
                                    className={`profile-nav-item ${view === 'profile' ? 'active' : ''}`}
                                    onClick={() => setView('profile')}
                                >
                                    <i className="fas fa-user me-3" /> Info
                                </button>
                                <button
                                    className={`profile-nav-item ${view === 'courses' ? 'active' : ''}`}
                                    onClick={() => setView('courses')}
                                >
                                    <i className="fas fa-graduation-cap me-3" /> My Courses
                                </button>
                                <button
                                    className={`profile-nav-item ${view === 'test' ? 'active' : ''}`}
                                    onClick={() => setView('test')}
                                >
                                    <i className="fas fa-calendar-alt me-3" /> Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="profile-card profile-content-area">
                            {view === 'profile' && (
                                <div className="fade-in">
                                    <div className="profile-section-header">
                                        <h3>Personal Info</h3>
                                        {!isEditing && (
                                            <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={onProfileUpdate} style={{ maxWidth: '500px' }}>
                                            <div className="form-group">
                                                <label className="form-label">Name</label>
                                                <input className="form-input" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Phone</label>
                                                <input className="form-input" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button type="submit" className="btn-primary">Save</button>
                                                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="row g-4">
                                            {[
                                                { label: 'Full Name', val: user?.name, icon: 'fa-user' },
                                                { label: 'Email', val: user?.email, icon: 'fa-envelope' },
                                                { label: 'Phone', val: user?.phone || 'Not set', icon: 'fa-phone' }
                                            ].map((item, i) => (
                                                <div key={i} className="col-md-6">
                                                    <div className="info-display-card">
                                                        <div className="info-label"><i className={`fas ${item.icon} me-2`} /> {item.label}</div>
                                                        <p className="info-value">{item.val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {view === 'courses' && (
                                <div className="fade-in">
                                    <h3>My Enrollments</h3>
                                    {myCourses.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '50px' }}>
                                            <p className="mb-4">No enrollments yet.</p>
                                            <Link to="/enroll" className="btn-primary">Enroll Now</Link>
                                        </div>
                                    ) : (
                                        <div className="row g-4">
                                            {myCourses.map((item) => (
                                                <div key={item._id} className="col-md-6">
                                                    <div className="enrollment-card">
                                                        <div className="enrollment-header">
                                                            <span className={`status-badge ${item.status}`}>{item.status.toUpperCase()}</span>
                                                            <small style={{ color: '#64748b' }}>{new Date(item.createdAt).toLocaleDateString()}</small>
                                                        </div>
                                                        <h5 className="enrollment-title">{item.course?.title || 'Admission Form'}</h5>
                                                        <button onClick={() => setSelectedForm(item)} className="btn-primary mt-3" style={{ width: '100%' }}>View Info</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedForm && (
                                        <div className="modal-overlay" onClick={() => setSelectedForm(null)}>
                                            <div className="modal-content-box" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => setSelectedForm(null)} className="modal-close-btn">&times;</button>
                                                <h3 style={{ marginBottom: '25px', color: '#1a237e' }}>Form Details</h3>

                                                {selectedForm.adminRemarks && (
                                                    <div className="form-alert" style={{ marginBottom: '20px' }}>
                                                        <strong>Admin Feedback:</strong> {selectedForm.adminRemarks}
                                                    </div>
                                                )}

                                                <div className="row">
                                                    <div className="col-md-6 detail-row">
                                                        <span className="detail-label">Name</span>
                                                        <span className="detail-data">{selectedForm.studentName}</span>
                                                    </div>
                                                    <div className="col-md-6 detail-row">
                                                        <span className="detail-label">Father's Name</span>
                                                        <span className="detail-data">{selectedForm.fatherName}</span>
                                                    </div>
                                                    <div className="col-md-6 detail-row">
                                                        <span className="detail-label">DOB</span>
                                                        <span className="detail-data">{`${selectedForm.dateOfBirth.day}/${selectedForm.dateOfBirth.month}/${selectedForm.dateOfBirth.year}`}</span>
                                                    </div>
                                                    <div className="col-md-6 detail-row">
                                                        <span className="detail-label">Aadhar</span>
                                                        <span className="detail-data">{selectedForm.aadharNumber}</span>
                                                    </div>
                                                </div>

                                                {selectedForm.status === 'cancelled' && (
                                                    <div style={{ marginTop: '20px' }}>
                                                        <Link to={`/enroll?edit=${selectedForm._id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Resubmit Form</Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {view === 'test' && (
                                <div className="fade-in">
                                    <h3>Weekly Test</h3>
                                    <div className="test-schedule-banner">
                                        <h4 style={{ opacity: 0.9, marginBottom: '10px' }}>Next Sunday Test</h4>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{nextTestDate()}</h2>
                                    </div>
                                    <div className="info-display-card" style={{ padding: 0, overflow: 'hidden' }}>
                                        {['Maths', 'Physics', 'Science'].map((subject, i) => (
                                            <div key={i} className="schedule-list-item">
                                                <span>{subject}</span>
                                                <span className="schedule-time">10:00 AM</span>
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