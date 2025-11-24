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
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
        session: false
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            avatar: req.user.avatar
        }))}`;
        res.redirect(redirectUrl);
    }
);
router.post('/google/token', async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({
                success: false,
                message: 'No access token provided'
            });
        }

        // Verify token with Google
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!googleResponse.ok) {
            throw new Error('Failed to verify token with Google');
        }

        const profile = await googleResponse.json();
        const { sub: googleId, email, name, picture } = profile;

        let user = await User.findOne({ googleId });

        if (!user) {
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser) {
                if (existingEmailUser.authProvider === 'local') {
                    existingEmailUser.googleId = googleId;
                    existingEmailUser.authProvider = 'google';
                    existingEmailUser.avatar = picture;
                    await existingEmailUser.save();
                    user = existingEmailUser;
                } else {
                    user = existingEmailUser;
                }
            } else {
                user = await User.create({
                    name,
                    email,
                    googleId,
                    authProvider: 'google',
                    avatar: picture,
                    phone: '0000000000'
                });
            }
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to authenticate with Google'
        });
    }
});
export default router;