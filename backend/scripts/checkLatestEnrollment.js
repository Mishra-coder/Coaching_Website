import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Enrollment from '../models/Enrollment.js';

dotenv.config();

const checkLatestEnrollment = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const enrollment = await Enrollment.findOne().sort({ createdAt: -1 });

        if (enrollment) {
            console.log('\n📊 Latest Enrollment Data Found:');
            console.log('-----------------------------------');
            console.log(`Student Name: ${enrollment.studentName}`);
            console.log(`Father's Name: ${enrollment.fatherName}`);
            console.log(`Mobile: ${enrollment.mobileNumber}`);
            console.log(`Address: ${enrollment.address}`);
            console.log(`Status: ${enrollment.status}`);
            console.log(`Created At: ${enrollment.createdAt}`);
            console.log('-----------------------------------');
            console.log('✅ Data is safely stored in "enrollments" collection in MongoDB Atlas!');
        } else {
            console.log('❌ No enrollments found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkLatestEnrollment();
