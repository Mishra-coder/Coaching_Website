import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Courses from './components/Courses';
import Faculty from './components/Faculty';
import Enrollment from './components/Enrollment';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import QuestionManager from './components/Admin/QuestionManager';
import StudentManager from './components/Admin/StudentManager';
import EnrollmentManager from './components/Admin/EnrollmentManager';
import DemoBooking from './components/DemoBooking';
import DemoBookingManager from './components/Admin/DemoBookingManager';
import ContestManager from './components/Admin/ContestManager';
import ContestQuiz from './components/ContestQuiz';
import ContestResult from './components/ContestResult';
import VideoManager from './components/Admin/VideoManager';
import Videos from './components/Videos';
import VideoPlayer from './components/VideoPlayer';
import Contests from './components/Contests';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <div className="App page-transition">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/faculty" element={<Faculty />} />
                        <Route path="/enroll" element={<Enrollment />} />
                        <Route path="/admission" element={<Enrollment />} />
                        <Route path="/demo-booking" element={
                            <ProtectedRoute>
                                <DemoBooking />
                            </ProtectedRoute>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/register" element={<SignUp />} />

                        <Route path="/quiz" element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        } />

                        <Route path="/contests" element={
                            <ProtectedRoute>
                                <Contests />
                            </ProtectedRoute>
                        } />

                        <Route path="/videos" element={
                            <ProtectedRoute>
                                <Videos />
                            </ProtectedRoute>
                        } />

                        <Route path="/video/:id" element={
                            <ProtectedRoute>
                                <VideoPlayer />
                            </ProtectedRoute>
                        } />

                        <Route path="/leaderboard" element={
                            <ProtectedRoute>
                                <Leaderboard />
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

                        <Route path="/admin/demo-bookings" element={
                            <AdminRoute>
                                <DemoBookingManager />
                            </AdminRoute>
                        } />

                        <Route path="/admin/contests" element={
                            <AdminRoute>
                                <ContestManager />
                            </AdminRoute>
                        } />

                        <Route path="/admin/videos" element={
                            <AdminRoute>
                                <VideoManager />
                            </AdminRoute>
                        } />

                        <Route path="/contest/:id" element={
                            <ProtectedRoute>
                                <ContestQuiz />
                            </ProtectedRoute>
                        } />

                        <Route path="/contest/:id/result" element={
                            <ProtectedRoute>
                                <ContestResult />
                            </ProtectedRoute>
                        } />
                    </Routes>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;