import React, { useState, useEffect } from 'react';
import { authAPI, quizAPI } from '../../services/api';

const StudentManager = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [performance, setPerformance] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await authAPI.getAllStudents();
            setStudents(res.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewStats = async (student) => {
        setSelectedStudent(student);
        // In a real app, we might have an API to get specific student's quiz history
        // For now, let's assume we can filter or have an endpoint
        // Let's mock performance or fetch if available
        setPerformance([
            { chapter: 'Real Numbers', score: 8, total: 10, date: '2023-10-20' },
            { chapter: 'Polynomials', score: 7, total: 10, date: '2023-10-22' }
        ]);
    };

    if (loading) return <div style={{ padding: '40px' }}>Loading students...</div>;

    return (
        <div style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '30px', color: '#1a237e' }}>Student Manager</h2>

            <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 1fr' : '1fr', gap: '30px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Phone</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{student.name}</td>
                                    <td style={{ padding: '12px' }}>{student.email}</td>
                                    <td style={{ padding: '12px' }}>{student.phone || 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button
                                            onClick={() => handleViewStats(student)}
                                            style={{ padding: '6px 12px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            View Performance
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedStudent && (
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>{selectedStudent.name}'s Performance</h3>
                            <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Close</button>
                        </div>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {performance.map((p, i) => (
                                <div key={i} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h5 style={{ margin: 0 }}>{p.chapter}</h5>
                                        <small style={{ color: '#666' }}>{p.date}</small>
                                    </div>
                                    <div style={{ color: '#1a237e', fontWeight: 'bold' }}>
                                        {p.score} / {p.total} ({Math.round((p.score / p.total) * 100)}%)
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManager;
