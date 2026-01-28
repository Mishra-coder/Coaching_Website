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
        <section className="enrollment-page" style={{ padding: '120px 0 60px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">
                        {role === 'admin' ? <span style={{ color: '#3949ab' }}>Admin</span> : 'Student'}{' '}
                        <span className="highlight">Login</span>
                    </h2>
                    <p className="section-subtitle">
                        {role === 'admin' ? 'Secure access for administrators' : 'Access your account to continue'}
                    </p>
                </div>
                <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
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
                        <div className="form-group" style={{ marginBottom: role === 'admin' ? '20px' : '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
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
                            {loading ? 'Logging in...' : 'Login'}
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
                        <GoogleSignInButton mode="signin" />
                        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '15px' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#ff6b35', fontWeight: '600', textDecoration: 'none' }}>
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