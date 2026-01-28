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
        <section className="enrollment-page" style={{ padding: '120px 0 60px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">
                        {role === 'admin' ? <span style={{ color: '#3949ab' }}>Admin</span> : 'Student'}{' '}
                        <span className="highlight">SignUp</span>
                    </h2>
                    <p className="section-subtitle">
                        {role === 'admin' ? 'Create your admin account' : 'Create your account to get started'}
                    </p>
                </div>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', marginBottom: '30px', background: '#f5f5f5', padding: '5px', borderRadius: '10px' }}>
                        <button
                            onClick={() => setRole('student')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '8px',
                                background: role === 'student' ? '#fff' : 'transparent',
                                color: role === 'student' ? '#4f46e5' : '#64748b',
                                fontWeight: '600',
                                boxShadow: role === 'student' ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '8px',
                                background: role === 'admin' ? '#fff' : 'transparent',
                                color: role === 'admin' ? '#3949ab' : '#64748b',
                                fontWeight: '600',
                                boxShadow: role === 'admin' ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            Admin
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                padding: '12px',
                                marginBottom: '20px',
                                backgroundColor: '#fee',
                                color: '#c33',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}
                        {role === 'student' && (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required={role === 'student'}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                        )}
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: role === 'admin' ? '20px' : '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                            />
                        </div>
                        {role === 'admin' && (
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#ef5350' }}>Admin Secret Key</label>
                                <input
                                    type="password"
                                    name="secretKey"
                                    value={formData.secretKey}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required={role === 'admin'}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: `1px solid ${formData.secretKey ? '#ddd' : '#ef5350'}`,
                                        borderRadius: '8px',
                                        fontSize: '15px'
                                    }}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>
                                    Contact the administrator to get the secret key
                                </p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Creating Account...' : 'SignUp'}
                        </button>
                        <div style={{
                            margin: '25px 0',
                            textAlign: 'center',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                            <span style={{ padding: '0 15px', color: '#999', fontSize: '14px' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                        </div>
                        <GoogleSignInButton mode="signup" />
                        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '15px' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#ff6b35', fontWeight: '600', textDecoration: 'none' }}>
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