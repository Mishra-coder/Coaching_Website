import React, { useState, useEffect } from 'react';
import { enrollmentsAPI } from '../../services/api';

const EnrollmentManager = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const res = await enrollmentsAPI.getAll();
            setEnrollments(res.enrollments);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus, remarks = '') => {
        try {
            await enrollmentsAPI.updateStatus(id, { status: newStatus, adminRemarks: remarks });
            fetchEnrollments();
            setSelectedEnrollment(prev => ({ ...prev, status: newStatus, adminRemarks: remarks }));
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="admin-container">Loading enrollments...</div>;

    return (
        <div className="admin-container">
            <h2 className="admin-header-title">Enrollment Manager</h2>

            <div className="admin-manager-layout" style={{ gridTemplateColumns: selectedEnrollment ? '1fr 1.2fr' : '1fr' }}>
                <div className="admin-card">
                    <h4 style={{ marginBottom: '20px' }}>All Submissions</h4>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((en) => (
                                    <tr key={en._id}>
                                        <td>{new Date(en.createdAt).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: '600' }}>{en.studentName}</td>
                                        <td>
                                            <span className={`status-badge ${en.status}`}>
                                                {en.status === 'completed' ? 'ADMISSION COMPLETED' : en.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedEnrollment(en)}
                                                className="btn-action btn-view"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedEnrollment && (
                    <div className="admin-card fade-in" style={{ position: 'sticky', top: '20px' }}>
                        <div className="details-panel-header">
                            <h3 style={{ margin: 0, color: '#1a237e' }}>Admission Details</h3>
                            <button onClick={() => setSelectedEnrollment(null)} className="close-btn">&times;</button>
                        </div>

                        <div style={{ display: 'flex', gap: '25px', marginBottom: '30px' }}>
                            {selectedEnrollment.photo ? (
                                <img src={selectedEnrollment.photo} alt="Student" className="student-photo-preview-large" />
                            ) : (
                                <div className="student-photo-preview-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                                    <i className="fas fa-user-circle" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 10px 0', fontWeight: '800' }}>{selectedEnrollment.studentName}</h4>
                                <p style={{ color: '#64748b', marginBottom: '15px' }}>Application ID: <br /><small>{selectedEnrollment._id}</small></p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <select
                                        value={selectedEnrollment.status}
                                        onChange={(e) => handleStatusUpdate(selectedEnrollment._id, e.target.value, selectedEnrollment.adminRemarks)}
                                        className="form-input"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active (Approve)</option>
                                        <option value="cancelled">Cancel (Reject)</option>
                                    </select>

                                    <div>
                                        <label className="detail-label">Admin Remarks / Reason</label>
                                        <textarea
                                            value={selectedEnrollment.adminRemarks || ''}
                                            onChange={(e) => setSelectedEnrollment({ ...selectedEnrollment, adminRemarks: e.target.value })}
                                            placeholder="e.g. Please upload a clearer photo or fix Aadhar number"
                                            className="form-input"
                                            style={{ minHeight: '80px' }}
                                        />
                                        <button
                                            onClick={() => handleStatusUpdate(selectedEnrollment._id, selectedEnrollment.status, selectedEnrollment.adminRemarks)}
                                            className="btn-primary w-100 mt-2"
                                        >
                                            Update Status & Remarks
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="details-grid">
                            <div>
                                <label className="detail-label">Father's Name</label>
                                <p className="info-value">{selectedEnrollment.fatherName}</p>
                            </div>
                            <div>
                                <label className="detail-label">Mother's Name</label>
                                <p className="info-value">{selectedEnrollment.motherName}</p>
                            </div>
                            <div>
                                <label className="detail-label">Date of Birth</label>
                                <p className="info-value">{selectedEnrollment.dateOfBirth.day}/{selectedEnrollment.dateOfBirth.month}/{selectedEnrollment.dateOfBirth.year}</p>
                            </div>
                            <div>
                                <label className="detail-label">Gender</label>
                                <p className="info-value" style={{ textTransform: 'capitalize' }}>{selectedEnrollment.gender}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="detail-label">Aadhar Number</label>
                                <p className="info-value" style={{ letterSpacing: '1px' }}>{selectedEnrollment.aadharNumber}</p>
                            </div>
                            <div>
                                <label className="detail-label">Mobile Number</label>
                                <p className="info-value">{selectedEnrollment.mobileNumber}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="detail-label">Address</label>
                                <p className="info-value">{selectedEnrollment.address}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrollmentManager;
