import express from 'express';
import { db } from '../database/jsonDb.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact form query (Logs to database)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const contactQuery = {
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Query',
      message,
      createdAt: new Date().toISOString()
    };

    // Save query to JSON database
    await db.insertOne('contacts', contactQuery);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your query has been recorded successfully.'
    });
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    res.status(500).json({ success: false, message: 'Server error processing your contact request' });
  }
});

export default router;

