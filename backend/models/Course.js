import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a course title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a course description']
    },
    class: {
        type: Number,
        required: [true, 'Please specify the class'],
        min: 1,
        max: 12
    },
    medium: {
        type: String,
        enum: ['English', 'Hindi', 'Both'],
        required: [true, 'Please specify the medium']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    duration: {
        type: String,
        required: [true, 'Please provide duration'],
        default: '1 Year'
    },
    features: [{
        type: String
    }],
    subjects: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Course = mongoose.model('Course', courseSchema);
export default Course;