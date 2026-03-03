import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { questionsAPI, coursesAPI, enrollmentsAPI } from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalCourses: 0,
        totalEnrolled: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const enrollmentId = searchParams.get('id');
        const action = searchParams.get('action');
        
        if (enrollmentId && action) {
            navigate(`/admin/enrollments?id=${enrollmentId}&action=${action}`);
            return;
        }
        
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [questions, courses, enrollments] = await Promise.all([
                    questionsAPI.getStats(),
                    coursesAPI.getStats(),
                    enrollmentsAPI.getStats()
                ]);
                setStats({
                    totalQuestions: questions.count || 0,
                    totalCourses: courses.count || 0,
                    totalEnrolled: enrollments.count || 0
                });
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-container">
            <h2 className="admin-header-title">Admin Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h1 className="stat-number" style={{ color: '#1a237e' }}>
                        {loading ? '...' : stats.totalQuestions}
                    </h1>
                    <p className="stat-label">Total Questions</p>
                    <Link to="/admin/questions" className="btn-primary">
                        Manage Questions
                    </Link>
                </div>
                <div className="stat-card">
                    <h1 className="stat-number" style={{ color: '#ffab00' }}>
                        {loading ? '...' : stats.totalCourses}
                    </h1>
                    <p className="stat-label">Total Courses</p>
                    <button className="btn-primary btn-disabled" disabled>
                        Manage Courses
                    </button>
                </div>
                <div className="stat-card">
                    <h1 className="stat-number" style={{ color: '#4caf50' }}>
                        {loading ? '...' : stats.totalEnrolled}
                    </h1>
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
