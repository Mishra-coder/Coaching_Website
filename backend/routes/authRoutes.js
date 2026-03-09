import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { addUserToSheet } from '../utils/googleSheets.js';

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log('Registration attempt:', { name, email, phone });

    const emailLower = email.toLowerCase();
    const hasAtSymbol = emailLower.includes('@');
    const parts = emailLower.split('@');
    
    let isValidEmail = false;
    if (hasAtSymbol && parts.length === 2) {
      const domain = parts[1];
      if (domain.endsWith('.com') || domain.endsWith('.in') || 
          domain.endsWith('.org') || domain.endsWith('.net') || 
          domain.endsWith('.edu') || domain.endsWith('.gov') ||
          domain.endsWith('.co.in') || domain.endsWith('.ac.in')) {
        isValidEmail = true;
      }
    }

    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message:
          'Please enter a valid email address with proper domain (.com, .in, .org, etc.)',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    let hasLowercase = false;
    let hasUppercase = false;
    let hasNumber = false;

    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      if (char >= 'a' && char <= 'z') hasLowercase = true;
      if (char >= 'A' && char <= 'Z') hasUppercase = true;
      if (char >= '0' && char <= '9') hasNumber = true;
    }

    if (!hasLowercase || !hasUppercase || !hasNumber) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists', email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
    });

    console.log('User created successfully:', newUser._id);

    addUserToSheet(newUser).catch((error) => {
      console.error('Failed to add user to Google Sheet:', error.message);
    });

    const authToken = signToken(newUser._id);

    res.status(201).json({
      success: true,
      token: authToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/admin-register', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    const emailLower = email.toLowerCase();
    const hasAtSymbol = emailLower.includes('@');
    const parts = emailLower.split('@');
    
    let isValidEmail = false;
    if (hasAtSymbol && parts.length === 2) {
      const domain = parts[1];
      if (domain.endsWith('.com') || domain.endsWith('.in') || 
          domain.endsWith('.org') || domain.endsWith('.net') || 
          domain.endsWith('.edu') || domain.endsWith('.gov') ||
          domain.endsWith('.co.in') || domain.endsWith('.ac.in')) {
        isValidEmail = true;
      }
    }

    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message:
          'Please enter a valid email address with proper domain (.com, .in, .org, etc.)',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    let hasLowercase = false;
    let hasUppercase = false;
    let hasNumber = false;

    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      if (char >= 'a' && char <= 'z') hasLowercase = true;
      if (char >= 'A' && char <= 'Z') hasUppercase = true;
      if (char >= '0' && char <= '9') hasNumber = true;
    }

    if (!hasLowercase || !hasUppercase || !hasNumber) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const correctSecretKey = 'admin123';
    if (secretKey !== correctSecretKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin secret key',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const adminUser = await User.create({
      name: name || 'Admin',
      email: email,
      password: password,
      role: 'admin',
      phone: 'N/A',
    });

    const authToken = signToken(adminUser._id);

    res.status(201).json({
      success: true,
      token: authToken,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const correctSecretKey = 'admin123';
    if (secretKey === correctSecretKey) {
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    } else {
      if (user.role === 'admin') {
        user.role = 'student';
        await user.save();
      }
    }

    const authToken = signToken(user._id);

    res.status(200).json({
      success: true,
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate(
      'enrollments'
    );

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const updatedFields = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/all-students', protect, authorize('admin'), async (req, res) => {
  try {
    const allStudents = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allStudents.length,
      students: allStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
