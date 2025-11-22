import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Courses from './components/Courses';
import Faculty from './components/Faculty';
import Enrollment from './components/Enrollment';
import Quiz from './components/Quiz';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/faculty" element={<Faculty />} />
                        <Route path="/enroll" element={<Enrollment />} />

                        <Route path="/quiz" element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
