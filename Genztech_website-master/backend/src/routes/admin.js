const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const Enrollment = require('../models/Enrollment');
const Application = require('../models/Application');
const Counselling = require('../models/Counselling');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  if (!expectedEmail || !expectedPassword) {
    return res.status(500).json({ detail: 'Admin credentials are not configured on the server.' });
  }

  if (
    String(email || '').trim().toLowerCase() !== expectedEmail ||
    String(password || '') !== expectedPassword
  ) {
    return res.status(401).json({ detail: 'Invalid admin email or password.' });
  }

  const token = jwt.sign({ role: 'admin', email: expectedEmail }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });
  res.json({ message: 'Admin login successful.', token });
});

router.get('/dashboard', requireAdmin, async (_req, res) => {
  const [enquiries, enrollments, applications, counselling, userCount] = await Promise.all([
    Enquiry.find().sort({ created_at: -1 }).limit(500).lean(),
    Enrollment.find().sort({ created_at: -1 }).limit(500).lean(),
    Application.find().sort({ created_at: -1 }).limit(500).lean(),
    Counselling.find().sort({ created_at: -1 }).limit(500).lean(),
    User.countDocuments()
  ]);

  res.json({
    summary: {
      users: userCount,
      enquiries: enquiries.length,
      enrollments: enrollments.length,
      applications: applications.length,
      counselling: counselling.length
    },
    enquiries,
    enrollments,
    applications,
    counselling
  });
});

router.get('/users', requireAdmin, async (_req, res) => {
  const users = await User.find()
    .select('Full_Name Email Phone_Number Course created_at')
    .sort({ created_at: -1 })
    .lean();
  res.json({ count: users.length, users });
});

module.exports = router;
