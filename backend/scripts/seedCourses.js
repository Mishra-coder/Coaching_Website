import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Course from '../models/Course.js';

dotenv.config();

// Sample courses data
const courses = [
    {
        title: 'Class 10th - Complete Course',
        description: 'Comprehensive preparation for Class 10th board exams with all subjects',
        class: 10,
        medium: 'Both',
        price: 15000,
        duration: '1 Year',
        subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
        features: [
            'Daily live classes',
            'Study material included',
            'Regular tests and assessments',
            'Doubt clearing sessions',
            'Board exam preparation'
        ]
    },
    {
        title: 'Class 12th - Science Stream',
        description: 'Complete preparation for Class 12th Science with Physics, Chemistry, and Mathematics',
        class: 12,
        medium: 'English',
        price: 20000,
        duration: '1 Year',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
        features: [
            'Expert faculty',
            'JEE/NEET foundation',
            'Board exam focused',
            'Regular mock tests',
            'Digital study material'
        ]
    },
    {
        title: 'Class 8th - Foundation Course',
        description: 'Strong foundation building for Class 8th students',
        class: 8,
        medium: 'Hindi',
        price: 12000,
        duration: '1 Year',
        subjects: ['Mathematics', 'Science', 'Social Science', 'Hindi', 'English'],
        features: [
            'Interactive learning',
            'Concept clarity focus',
            'Regular practice sessions',
            'Parent-teacher meetings',
            'Progress tracking'
        ]
    },
    {
        title: 'Class 9th - Complete Course',
        description: 'Comprehensive course for Class 9th with focus on board preparation',
        class: 9,
        medium: 'Both',
        price: 14000,
        duration: '1 Year',
        subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
        features: [
            'Experienced teachers',
            'Regular assessments',
            'Study material provided',
            'Doubt sessions',
            'Exam preparation'
        ]
    },
    {
        title: 'Class 11th - Science Stream',
        description: 'Foundation course for Class 11th Science students',
        class: 11,
        medium: 'English',
        price: 18000,
        duration: '1 Year',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
        features: [
            'JEE/NEET preparation',
            'Conceptual learning',
            'Problem-solving focus',
            'Weekly tests',
            'Digital resources'
        ]
    },
    {
        title: 'Class 6th - Foundation Course',
        description: 'Building strong fundamentals for Class 6th students',
        class: 6,
        medium: 'Hindi',
        price: 10000,
        duration: '1 Year',
        subjects: ['Mathematics', 'Science', 'Social Science', 'Hindi', 'English'],
        features: [
            'Fun learning approach',
            'Activity-based learning',
            'Regular practice',
            'Personalized attention',
            'Monthly assessments'
        ]
    }
];

const seedCourses = async () => {
    try {
        await connectDB();

        // Clear existing courses
        await Course.deleteMany();
        console.log('🗑️  Existing courses deleted');

        // Insert new courses
        const createdCourses = await Course.insertMany(courses);
        console.log(`✅ ${createdCourses.length} courses seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding courses:', error);
        process.exit(1);
    }
};

seedCourses();
