import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide the question text'],
        trim: true
    },
    options: {
        type: [String],
        required: [true, 'Please provide at least two options'],
        validate: [v => Array.isArray(v) && v.length >= 2, 'Options must have at least 2 items']
    },
    correctAnswer: {
        type: String,
        required: [true, 'Please provide the correct answer']
    },
    class: {
        type: String,
        required: [true, 'Please specify the class level'],
        enum: ['10', '12']
    },
    chapter: {
        type: String,
        required: [true, 'Please specify the chapter name']
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
