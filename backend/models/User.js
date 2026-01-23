import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        match: [/^[0-9]{10}$/, 'Invalid 10-digit phone number']
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    enrollments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (attemptedPassword) {
    return await bcrypt.compare(attemptedPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;