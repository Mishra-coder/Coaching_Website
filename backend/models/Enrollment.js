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
        required: [true, 'Please provide student name']
    },
    fatherName: {
        type: String,
        required: [true, 'Please provide father name']
    },
    motherName: {
        type: String,
        required: [true, 'Please provide mother name']
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
        required: [true, 'Please provide address']
    },
    aadharNumber: {
        type: String,
        required: [true, 'Please provide Aadhar number'],
        match: [/^[0-9]{12}$/, 'Please provide a valid 12-digit Aadhar number']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Please provide mobile number'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
    },
    photo: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
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
