import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    },
    studentName: {
        type: String,
        required: [true, 'Student name is required']
    },
    fatherName: {
        type: String,
        required: [true, 'Father name is required']
    },
    motherName: {
        type: String,
        required: [true, 'Mother name is required']
    },
    dateOfBirth: {
        day: { type: Number, required: true, min: 1, max: 31 },
        month: { type: Number, required: true, min: 1, max: 12 },
        year: { type: Number, required: true, min: 2000, max: 2025 }
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    aadharNumber: {
        type: String,
        required: [true, 'Aadhar number is required'],
        match: [/^[0-9]{12}$/, 'Invalid 12-digit Aadhar']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^[0-9]{10}$/, 'Invalid 10-digit mobile number']
    },
    photo: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'cancelled'],
        default: 'pending'
    },
    adminRemarks: {
        type: String,
        default: ''
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;