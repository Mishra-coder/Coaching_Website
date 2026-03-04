import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { enrollmentsAPI } from '../../services/api';

const EnrollmentManager = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchEnrollments();
    }, []);

    useEffect(() => {
        const enrollmentId = searchParams.get('id');
        const action = searchParams.get('action');
        
        if (enrollmentId && action && enrollments.length > 0) {
            const enrollment = enrollments.find(e => e._id === enrollmentId);
            if (enrollment) {
                setSelectedEnrollment(enrollment);
                if (action === 'approve' || action === 'cancel') {
                    const newStatus = action === 'approve' ? 'active' : 'cancelled';
                    handleQuickAction(enrollmentId, newStatus, action);
                    setSearchParams({});
                }
            }
        }
    }, [enrollments, searchParams]);

    const handleQuickAction = async (id, newStatus, action) => {
        try {
            await enrollmentsAPI.updateStatus(id, { status: newStatus, adminRemarks: '' });
            fetchEnrollments();
            setSelectedEnrollment(prev => ({ ...prev, status: newStatus, adminRemarks: '' }));
            const successMsg = action === 'approve' 
                ? 'Application approved successfully!' 
                : 'Application cancelled successfully!';
            alert(successMsg);
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id, studentName) => {
        if (!window.confirm(`Are you sure you want to delete ${studentName}'s enrollment? This action cannot be undone.`)) {
            return;
        }

        try {
            await enrollmentsAPI.delete(id);
            alert('Enrollment deleted successfully!');
            fetchEnrollments();
            if (selectedEnrollment?._id === id) {
                setSelectedEnrollment(null);
            }
        } catch (error) {
            alert('Failed to delete enrollment: ' + (error.response?.data?.message || error.message));
        }
    };

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const res = await enrollmentsAPI.getAll();
            setEnrollments(res.enrollments);
        } catch (error) {
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
            alert('Failed to update status');
        }
    };

    if (loading) return (
        <div className="admin-container">
            <h2 className="admin-header-title">Enrollment Manager</h2>
            <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
                <p style={{ color: '#64748b' }}>Loading enrollments...</p>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            <h2 className="admin-header-title">Enrollment Manager</h2>

            <div className="admin-manager-layout" style={{ gridTemplateColumns: selectedEnrollment ? '1fr 1.2fr' : '1fr' }}>
                <div className="admin-card">
                    <h4 style={{ marginBottom: '20px' }}>All Submissions</h4>
                    
                    <div className="enrollment-list-mobile">
                        {enrollments.map((en) => (
                            <div key={en._id} className="enrollment-card-mobile">
                                <div className="enrollment-card-header">
                                    <div>
                                        <div className="enrollment-student-name">{en.studentName}</div>
                                        <div className="enrollment-date">{new Date(en.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`status-badge ${en.status}`}>
                                        {en.status === 'completed' ? 'COMPLETED' : en.status.toUpperCase()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedEnrollment(en)}
                                    className="btn-action btn-view"
                                    style={{ width: '100%', marginTop: '10px' }}
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleDelete(en._id, en.studentName)}
                                    className="btn-action"
                                    style={{ width: '100%', marginTop: '10px', backgroundColor: '#dc3545', color: 'white' }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="admin-table-wrapper enrollment-table-desktop">
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
                                                style={{ marginRight: '10px' }}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(en._id, en.studentName)}
                                                className="btn-action"
                                                style={{ backgroundColor: '#dc3545', color: 'white' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedEnrollment && (
                    <div className="admin-card fade-in enrollment-details-panel">
                        <div className="details-panel-header">
                            <h3 style={{ margin: 0, color: '#1a237e' }}>Admission Details</h3>
                            <button onClick={() => setSelectedEnrollment(null)} className="close-btn">&times;</button>
                        </div>

                        <div className="enrollment-details-top">
                            {selectedEnrollment.photo ? (
                                <img src={selectedEnrollment.photo} alt="Student" className="student-photo-preview-large" />
                            ) : (
                                <div className="student-photo-preview-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                                    <i className="fas fa-user-circle" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 10px 0', fontWeight: '800' }}>{selectedEnrollment.studentName}</h4>
                                <p style={{ color: '#64748b', marginBottom: '15px', wordBreak: 'break-all' }}>Application ID: <br /><small>{selectedEnrollment._id}</small></p>

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
                            <div className="details-grid-full">
                                <label className="detail-label">Aadhar Number</label>
                                <p className="info-value" style={{ letterSpacing: '1px' }}>{selectedEnrollment.aadharNumber}</p>
                            </div>
                            <div>
                                <label className="detail-label">Mobile Number</label>
                                <p className="info-value">{selectedEnrollment.mobileNumber}</p>
                            </div>
                            <div className="details-grid-full">
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
