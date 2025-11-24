import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import logo from '../assets/logo.png';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [totalXP, setTotalXP] = useState(0);
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        if (isAuthenticated() && user) {
            fetchXP();
        }
        window.addEventListener('quizCompleted', fetchXP);
        return () => window.removeEventListener('quizCompleted', fetchXP);
    }, [isAuthenticated, user, location.pathname]);
    const fetchXP = async () => {
        try {
            const data = await quizAPI.getHistory();
            const xp = data.history.reduce((acc, curr) => acc + curr.score, 0);
            setTotalXP(xp);
        } catch (error) {
            console.error('Error fetching XP:', error);
        }
    };
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const closeMenu = () => {
        setIsOpen(false);
    };
    const handleLogout = () => {
        logout();
        closeMenu();
    };
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }
    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
            boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
            <div className="container nav-container">
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }} onClick={closeMenu}>
                    <img src={logo} alt="Success Mantra Logo" style={{ height: '45px', marginRight: '10px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                        <div>
                            <span style={{
                                color: '#1a237e',
                                fontWeight: '800',
                                fontSize: '24px'
                            }}>Success</span>
                            <span style={{
                                color: '#ffab00',
                                fontWeight: '800',
                                fontSize: '24px',
                                marginLeft: '5px',
                                textShadow: '1px 1px 0 #000'
                            }}>मंत्रा</span>
                        </div>
                        <span style={{
                            color: '#1a237e',
                            fontSize: '14px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            marginTop: '2px'
                        }}>INSTITUTE</span>
                    </div>
                </Link>
                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>
                    <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About</Link>
                    <Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''} onClick={closeMenu}>Courses</Link>
                    <Link to="/faculty" className={location.pathname === '/faculty' ? 'active' : ''} onClick={closeMenu}>Faculty</Link>
                    <Link to="/quiz" className={location.pathname === '/quiz' ? 'active' : ''} onClick={closeMenu}>Quiz</Link>
                    {isAuthenticated() ? (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#fff7ed',
                                border: '1px solid #ffedd5',
                                borderRadius: '50px',
                                padding: '4px 12px 4px 4px',
                                marginRight: '10px'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '8px',
                                    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                                }}>
                                    <i className="fas fa-bolt" style={{ color: '#fff', fontSize: '0.8rem' }}></i>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#9a3412', fontWeight: '600', textTransform: 'uppercase' }}>XP</span>
                                    <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '800' }}>{totalXP}</span>
                                </div>
                            </div>
                            <Link to="/profile" className="btn-outline-primary" style={{ marginRight: '8px', border: '1px solid #1a237e', padding: '6px 12px', borderRadius: '20px', textDecoration: 'none', color: '#1a237e', fontSize: '0.9rem' }} onClick={closeMenu}>
                                Profile
                            </Link>
                            <Link to="/enroll" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem', marginRight: '8px' }} onClick={closeMenu}>Enroll</Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 16px',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="btn-secondary"
                                onClick={closeMenu}
                                style={{ marginRight: '10px' }}
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="btn-primary"
                                onClick={closeMenu}
                                style={{
                                    animation: 'pulse-glow 2s infinite',
                                    boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)'
                                }}
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
                <div className="hamburger" onClick={toggleMenu}>
                    <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;