import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        secretKey: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            if (role === 'admin') {
                if (result.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    setError('Access Denied: Admin privileges required.');
                    setLoading(false);
                }
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="container">
                <div className="auth-header">
                    <h2 className="auth-title">
                        {role === 'admin' ? <span style={{ color: '#3949ab' }}>Admin</span> : 'Student'}{' '}
                        <span className="highlight">Login</span>
                    </h2>
                    <p className="auth-subtitle">
                        {role === 'admin' ? 'Secure access for administrators' : 'Access your account to continue'}
                    </p>
                </div>

                <div className="auth-card">
                    <div className="role-switcher">
                        <button
                            onClick={() => setRole('student')}
                            className={`role-btn ${role === 'student' ? 'active-student' : ''}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`role-btn ${role === 'admin' ? 'active-admin' : ''}`}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="form-alert">{error}</div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="form-input"
                            />
                        </div>

                        {role === 'admin' && (
                            <div className="form-group">
                                <label className="form-label form-label-admin">Admin Secret Key</label>
                                <input
                                    type="password"
                                    name="secretKey"
                                    value={formData.secretKey}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required={role === 'admin'}
                                    className={`form-input ${!formData.secretKey ? 'form-input-error' : ''}`}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn-primary btn-block ${loading ? 'btn-loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="auth-divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">OR</span>
                            <div className="divider-line"></div>
                        </div>

                        <GoogleSignInButton mode="signin" />

                        <div className="auth-footer">
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                SignUp here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;