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
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import QuestionManager from './components/Admin/QuestionManager';
import StudentManager from './components/Admin/StudentManager';
import EnrollmentManager from './components/Admin/EnrollmentManager';

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
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

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

                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        } />

                        <Route path="/admin/questions" element={
                            <AdminRoute>
                                <QuestionManager />
                            </AdminRoute>
                        } />

                        <Route path="/admin/students" element={
                            <AdminRoute>
                                <StudentManager />
                            </AdminRoute>
                        } />

                        <Route path="/admin/enrollments" element={
                            <AdminRoute>
                                <EnrollmentManager />
                            </AdminRoute>
                        } />
                    </Routes>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;