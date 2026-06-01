const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const {
    Full_Name,
    Email,
    Phone_Number = '',
    Password,
    Confirm_Password
  } = req.body || {};

  if (!Full_Name || !Email || !Password) {
    return res.status(400).json({ detail: 'Full name, email and password are required.' });
  }
  if (Password.length < 6) {
    return res.status(400).json({ detail: 'Password must be at least 6 characters.' });
  }
  if (Confirm_Password !== undefined && Password !== Confirm_Password) {
    return res.status(400).json({ detail: 'Passwords do not match.' });
  }

  const normalizedEmail = String(Email).trim().toLowerCase();
  const existing = await User.findOne({ Email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ detail: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(Password, 10);
  const user = await User.create({
    Full_Name: Full_Name.trim(),
    Email: normalizedEmail,
    Phone_Number: String(Phone_Number).trim(),
    passwordHash
  });

  res.status(201).json({ message: 'Signup successful.', user: user.toPublicJSON() });
});

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body || {};
  if (!Email || !Password) {
    return res.status(400).json({ detail: 'Email and password are required.' });
  }

  const user = await User.findOne({ Email: String(Email).trim().toLowerCase() });
  if (!user) {
    return res.status(401).json({ detail: 'Invalid email or password.' });
  }

  const ok = await bcrypt.compare(Password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ detail: 'Invalid email or password.' });
  }

  res.json({ message: 'Login successful.', user: user.toPublicJSON() });
});

module.exports = router;
