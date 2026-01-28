import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    options: {
        type: [String],
        required: [true, 'At least 2 options are required'],
        validate: [v => Array.isArray(v) && v.length >= 2, 'Options array must have at least 2 items']
    },
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required']
    },
    class: {
        type: String,
        required: [true, 'Class level is required'],
        enum: ['10', '12']
    },
    chapter: {
        type: String,
        required: [true, 'Chapter name is required']
    },
    subject: {
        type: String,
        default: 'Mathematics'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
