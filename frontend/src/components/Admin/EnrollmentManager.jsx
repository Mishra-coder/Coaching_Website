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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await enrollmentsAPI.updateStatus(id, newStatus);
            fetchEnrollments();
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>Loading enrollments...</div>;

    return (
        <div style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '30px', color: '#1a237e' }}>Enrollment Manager</h2>

            <div style={{ display: 'grid', gridTemplateColumns: selectedEnrollment ? '1fr 1.2fr' : '1fr', gap: '30px', alignItems: 'start' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ marginBottom: '20px' }}>All Submissions</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '15px', color: '#64748b' }}>Date</th>
                                    <th style={{ padding: '15px', color: '#64748b' }}>Student Name</th>
                                    <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                                    <th style={{ padding: '15px', color: '#64748b' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((en) => (
                                    <tr key={en._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>{new Date(en.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontWeight: '600' }}>{en.studentName}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                background: en.status === 'active' ? '#dcfce7' : en.status === 'pending' ? '#fef9c3' : '#fee2e2',
                                                color: en.status === 'active' ? '#166534' : en.status === 'pending' ? '#854d0e' : '#991b1b'
                                            }}>
                                                {en.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button
                                                onClick={() => setSelectedEnrollment(en)}
                                                style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #1a237e', background: 'none', color: '#1a237e', cursor: 'pointer', fontWeight: '600' }}
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
                    <div className="fade-in" style={{ background: '#fff', padding: '35px', borderRadius: '25px', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', sticky: 'top' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3 style={{ margin: 0, color: '#1a237e' }}>Admission Details</h3>
                            <button onClick={() => setSelectedEnrollment(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        </div>

                        <div style={{ display: 'flex', gap: '25px', marginBottom: '30px' }}>
                            {selectedEnrollment.photo ? (
                                <img src={selectedEnrollment.photo} alt="Student" style={{ width: '120px', height: '150px', objectFit: 'cover', borderRadius: '15px', border: '3px solid #f1f5f9' }} />
                            ) : (
                                <div style={{ width: '120px', height: '150px', background: '#f8fafc', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1' }}>
                                    <i className="fas fa-user-circle" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                                </div>
                            )}
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontWeight: '800' }}>{selectedEnrollment.studentName}</h4>
                                <p style={{ color: '#64748b', marginBottom: '15px' }}>Application ID: <br /><small>{selectedEnrollment._id}</small></p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        value={selectedEnrollment.status}
                                        onChange={(e) => handleStatusUpdate(selectedEnrollment._id, e.target.value)}
                                        style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active (Approve)</option>
                                        <option value="cancelled">Cancel</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Father's Name</label>
                                <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedEnrollment.fatherName}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Mother's Name</label>
                                <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedEnrollment.motherName}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Date of Birth</label>
                                <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedEnrollment.dateOfBirth.day}/{selectedEnrollment.dateOfBirth.month}/{selectedEnrollment.dateOfBirth.year}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Gender</label>
                                <p style={{ fontWeight: '600', color: '#1e293b', textTransform: 'capitalize' }}>{selectedEnrollment.gender}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Aadhar Number</label>
                                <p style={{ fontWeight: '600', color: '#1e293b', letterSpacing: '2px' }}>{selectedEnrollment.aadharNumber}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Mobile Number</label>
                                <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedEnrollment.mobileNumber}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Address</label>
                                <p style={{ fontWeight: '600', color: '#1e293b', lineHeight: '1.6' }}>{selectedEnrollment.address}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrollmentManager;
