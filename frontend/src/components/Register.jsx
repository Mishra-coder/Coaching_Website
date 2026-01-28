import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import GoogleSignInButton from './GoogleSignInButton';

const Register = () => {
    const navigate = useNavigate();
    const { register, setAuth } = useAuth();

    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (role === 'admin') {
                const response = await authAPI.adminRegister({
                    email: formData.email,
                    password: formData.password,
                    secretKey: formData.secretKey
                });

                if (response.success) {
                    setAuth(response.user, response.token);
                    navigate('/admin');
                } else {
                    setError(response.message || 'SignUp failed');
                }
            } else {
                const { confirmPassword, secretKey, ...userData } = formData;
                const result = await register(userData);

                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'SignUp failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="container">
                <div className="auth-header">
                    <h2 className="auth-title">
                        {role === 'admin' ? <span style={{ color: '#3949ab' }}>Admin</span> : 'Student'}{' '}
                        <span className="highlight">SignUp</span>
                    </h2>
                    <p className="auth-subtitle">
                        {role === 'admin' ? 'Create your admin account' : 'Create your account to get started'}
                    </p>
                </div>

                <div className="auth-card auth-card-lg">
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

                        {role === 'student' && (
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required={role === 'student'}
                                    className="form-input"
                                />
                            </div>
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
                                placeholder="Minimum 6 characters"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
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
                                <p className="helper-text">
                                    Contact the administrator to get the secret key
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn-primary btn-block ${loading ? 'btn-loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'SignUp'}
                        </button>

                        <div className="auth-divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">OR</span>
                            <div className="divider-line"></div>
                        </div>

                        <GoogleSignInButton mode="signup" />

                        <div className="auth-footer">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Login here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;