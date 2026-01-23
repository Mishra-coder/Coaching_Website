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
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" />
        </div>
    );

    const commonCard = {
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
    };

    const linkStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        margin: '5px 0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: active ? 'linear-gradient(45deg, #1a237e, #3949ab)' : 'transparent',
        color: active ? '#fff' : '#64748b',
        fontWeight: active ? '600' : '500',
        border: 'none',
        width: '100%'
    });

    return (
        <div className="profile-page" style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-3">
                        <div style={commonCard}>
                            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(26,35,126,0.05) 0%, rgba(255,255,255,0) 100%)' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, #1a237e, #ffab00)', padding: '3px', margin: '0 auto 20px' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#1a237e' }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <h4 style={{ fontWeight: '700', marginBottom: '5px' }}>{user?.name}</h4>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.email}</p>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <button style={linkStyle(view === 'profile')} onClick={() => setView('profile')}>
                                    <i className="fas fa-user me-3" /> Info
                                </button>
                                <button style={linkStyle(view === 'courses')} onClick={() => setView('courses')}>
                                    <i className="fas fa-graduation-cap me-3" /> My Courses
                                </button>
                                <button style={linkStyle(view === 'test')} onClick={() => setView('test')}>
                                    <i className="fas fa-calendar-alt me-3" /> Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div style={{ ...commonCard, padding: '40px', minHeight: '600px' }}>
                            {view === 'profile' && (
                                <div className="fade-in">
                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                        <h3>Personal Info</h3>
                                        {!isEditing && (
                                            <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={onProfileUpdate} style={{ maxWidth: '500px' }}>
                                            <div className="mb-4">
                                                <label className="form-label">Name</label>
                                                <input type="text" className="form-control" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Phone</label>
                                                <input type="text" className="form-control" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                                            </div>
                                            <div className="d-flex gap-2">
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
                                                    <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '15px' }}>
                                                        <small style={{ color: '#64748b' }}><i className={`fas ${item.icon} me-2`} /> {item.label}</small>
                                                        <p style={{ margin: 0, fontWeight: '600' }}>{item.val}</p>
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
                                        <div className="text-center p-5">
                                            <p>No enrollments yet.</p>
                                            <Link to="/enroll" className="btn-primary">Enroll Now</Link>
                                        </div>
                                    ) : (
                                        <div className="row g-4">
                                            {myCourses.map((item) => (
                                                <div key={item._id} className="col-md-6">
                                                    <div style={{ padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span className={`badge ${item.status}`}>{item.status.toUpperCase()}</span>
                                                            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                                                        </div>
                                                        <h5>{item.course?.title || 'Admission Form'}</h5>
                                                        <button onClick={() => setSelectedForm(item)} className="btn-primary w-100 mt-2">View Info</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedForm && (
                                        <div className="custom-modal-overlay" onClick={() => setSelectedForm(null)}>
                                            <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                                                <div className="d-flex justify-content-between mb-4">
                                                    <h3>Form Details</h3>
                                                    <button onClick={() => setSelectedForm(null)} className="close-btn">&times;</button>
                                                </div>

                                                <div className="row g-4">
                                                    {selectedForm.adminRemarks && (
                                                        <div className="col-12 alert-box warning">
                                                            <strong>Admin Feedback:</strong> {selectedForm.adminRemarks}
                                                        </div>
                                                    )}
                                                    <div className="col-md-6"><strong>Name:</strong> {selectedForm.studentName}</div>
                                                    <div className="col-md-6"><strong>Father:</strong> {selectedForm.fatherName}</div>
                                                    <div className="col-md-6"><strong>DOB:</strong> {`${selectedForm.dateOfBirth.day}/${selectedForm.dateOfBirth.month}/${selectedForm.dateOfBirth.year}`}</div>
                                                    <div className="col-md-6"><strong>Aadhar:</strong> {selectedForm.aadharNumber}</div>
                                                    {selectedForm.status === 'cancelled' && (
                                                        <div className="col-12">
                                                            <Link to={`/enroll?edit=${selectedForm._id}`} className="btn-primary w-100 text-center">Resubmit Form</Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {view === 'test' && (
                                <div className="fade-in">
                                    <h3>Weekly Test</h3>
                                    <div className="test-banner">
                                        <h4>Next Sunday Test</h4>
                                        <h2>{nextTestDate()}</h2>
                                    </div>
                                    <div className="mt-4">
                                        {['Maths', 'Physics', 'Science'].map((subject, i) => (
                                            <div key={i} className="test-item">
                                                <span>{subject}</span>
                                                <span className="time">10:00 AM</span>
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