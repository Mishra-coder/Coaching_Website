import express from 'express';
import DemoBooking from '../models/DemoBooking.js';
import { protect } from '../middleware/auth.js';
import { sendDemoBookingNotification } from '../utils/email.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        const { name, phone, preferredDate, preferredTime } = req.body;

        const demoBooking = await DemoBooking.create({
            name,
            phone,
            preferredDate,
            preferredTime,
            user: req.user.id
        });

        sendDemoBookingNotification(demoBooking).catch(err => {
            console.error('Failed to send demo booking email:', err.message);
        });

        res.status(201).json({ 
            success: true, 
            message: 'Demo booking submitted successfully', 
            booking: demoBooking 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const bookings = await DemoBooking.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ 
            success: true, 
            count: bookings.length, 
            bookings 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id/status', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const { status, adminRemarks } = req.body;
        const booking = await DemoBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        if (adminRemarks !== undefined) booking.adminRemarks = adminRemarks;

        await booking.save();

        res.status(200).json({ 
            success: true, 
            message: 'Status updated successfully', 
            booking 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        const booking = await DemoBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await DemoBooking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
