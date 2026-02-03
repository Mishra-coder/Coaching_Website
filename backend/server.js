import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import connectDB from './config/db.js';
import passport from './config/googleAuth.js';


import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import googleAuthRoutes from './routes/google.js';
import questionRoutes from './routes/questionRoutes.js';

dotenv.config();


connectDB();

const app = express();



app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/questions', questionRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', timestamp: new Date() });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

});