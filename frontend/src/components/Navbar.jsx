import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [xpBalance, setXpBalance] = useState(0);

    const navigate = useNavigate();
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
        // Redirect to home page after logout
        navigate('/');
        closeNav();
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    if (isAuthPage) return null;

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="nav-logo-link" onClick={closeNav}>
                    <img src={logo} alt="Logo" className="footer-logo-img" />
                    <div className="footer-logo-text">
                        <div>
                            <span className="nav-brand-main">Success</span>
                            <span className="nav-brand-sub">मंत्रा</span>
                        </div>
                        <span className="nav-brand-tag">INSTITUTE</span>
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
                            <Link to="/leaderboard" className="nav-xp-container" style={{ textDecoration: 'none' }}>
                                <div className="nav-xp-icon">
                                    <i className="fas fa-bolt" style={{ color: '#fff', fontSize: '0.8rem' }}></i>
                                </div>
                                <div className="nav-xp-details">
                                    <span className="xp-label">XP</span>
                                    <span className="xp-value">{xpBalance}</span>
                                </div>
                            </Link>

                            <Link to="/profile" className="btn-profile-outline" onClick={closeNav}>
                                Profile
                            </Link>

                            <Link to="/enroll" className="btn-primary btn-nav-action" onClick={closeNav}>Enroll</Link>

                            <button onClick={onLogout} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn-secondary btn-signup" onClick={closeNav}>SignUp</Link>
                            <Link to="/login" className="btn-primary btn-login-pulse" onClick={closeNav}>Login</Link>
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