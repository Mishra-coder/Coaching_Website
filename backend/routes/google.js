import express from 'express';
import passport from '../config/googleAuth.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?err=google_fail`,
        session: false
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        const userData = encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            avatar: req.user.avatar
        }));

        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${userData}`);
    }
);

router.post('/google/token', async (req, res) => {
    try {
        console.log('Received Google token request');
        const { access_token } = req.body;

        if (!access_token) {
            console.error('No access token provided');
            return res.status(400).json({ success: false, message: 'Missing token' });
        }

        console.log('Verifying token with Google...');
        // Correcting the fetch URL and syntax
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!googleRes.ok) {
            const errorText = await googleRes.text();
            console.error('Google verification failed:', googleRes.status, errorText);
            throw new Error('Google verification failed');
        }

        const profile = await googleRes.json();
        console.log('Google profile received:', { email: profile.email, googleId: profile.sub });

        const { sub: googleId, email, name, picture } = profile;

        let user = await User.findOne({ googleId });

        if (!user) {
            console.log('User not found by googleId, checking email...');
            const emailUser = await User.findOne({ email });
            if (emailUser) {
                console.log('User found by email, updating...');
                if (emailUser.authProvider === 'local') {
                    emailUser.googleId = googleId;
                    emailUser.authProvider = 'google';
                    emailUser.avatar = picture;
                    await emailUser.save();
                    user = emailUser;
                } else {
                    user = emailUser;
                }
            } else {
                console.log('Creating new user...');
                user = await User.create({
                    name, email, googleId,
                    authProvider: 'google',
                    avatar: picture,
                    phone: '0000000000'
                });
            }
        } else {
            console.log('User found by googleId');
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        console.log('Login successful, sending token');

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(500).json({ success: false, message: 'Auth failed', error: err.message });
    }
});

export default router;