import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [xpBalance, setXpBalance] = useState(0);

    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isAuthenticated() && user) {
            updateXP();
        }
        window.addEventListener('quizCompleted', updateXP);
        return () => window.removeEventListener('quizCompleted', updateXP);
    }, [isAuthenticated, user, location.pathname]);

    const updateXP = async () => {
        try {
            const data = await quizAPI.getHistory();
            const total = data.history.reduce((acc, curr) => acc + curr.score, 0);
            setXpBalance(total);
        } catch (error) {
            console.error('Failed to update XP:', error);
        }
    };

    const toggleNav = () => setIsMenuOpen(!isMenuOpen);
    const closeNav = () => setIsMenuOpen(false);

    const onLogout = () => {
        logout();
        closeNav();
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    if (isAuthPage) return null;

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
            boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
            <div className="container nav-container">
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }} onClick={closeNav}>
                    <img src={logo} alt="Logo" style={{ height: '45px', marginRight: '10px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                        <div>
                            <span style={{ color: '#1a237e', fontWeight: '800', fontSize: '24px' }}>Success</span>
                            <span style={{ color: '#ffab00', fontWeight: '800', fontSize: '24px', marginLeft: '5px', textShadow: '1px 1px 0 #000' }}>मंत्रा</span>
                        </div>
                        <span style={{ color: '#1a237e', fontSize: '14px', fontWeight: '600', letterSpacing: '1px', marginTop: '2px' }}>INSTITUTE</span>
                    </div>
                </Link>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeNav}>Home</Link>
                    <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeNav}>About</Link>
                    <Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''} onClick={closeNav}>Courses</Link>
                    <Link to="/faculty" className={location.pathname === '/faculty' ? 'active' : ''} onClick={closeNav}>Faculty</Link>
                    <Link to="/quiz" className={location.pathname === '/quiz' ? 'active' : ''} onClick={closeNav}>Quiz</Link>

                    {isAuthenticated() && user?.role === 'admin' && (
                        <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''} onClick={closeNav}>Admin Panel</Link>
                    )}

                    {isAuthenticated() ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '50px', padding: '4px 12px 4px 4px', marginRight: '10px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)' }}>
                                    <i className="fas fa-bolt" style={{ color: '#fff', fontSize: '0.8rem' }}></i>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#9a3412', fontWeight: '600', textTransform: 'uppercase' }}>XP</span>
                                    <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '800' }}>{xpBalance}</span>
                                </div>
                            </div>

                            <Link to="/profile" className="btn-outline-primary" style={{ marginRight: '8px', border: '1px solid #1a237e', padding: '6px 12px', borderRadius: '20px', textDecoration: 'none', color: '#1a237e', fontSize: '0.9rem' }} onClick={closeNav}>
                                Profile
                            </Link>

                            <Link to="/enroll" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem', marginRight: '8px' }} onClick={closeNav}>Enroll</Link>

                            <button onClick={onLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '25px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn-secondary" onClick={closeNav} style={{ marginRight: '10px' }}>SignUp</Link>
                            <Link to="/login" className="btn-primary" onClick={closeNav} style={{ animation: 'pulse-glow 2s infinite', boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)' }}>Login</Link>
                        </>
                    )}
                </div>

                <div className="hamburger" onClick={toggleNav}>
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;