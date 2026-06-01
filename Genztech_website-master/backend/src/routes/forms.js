const express = require('express');
const Enquiry = require('../models/Enquiry');
const Enrollment = require('../models/Enrollment');
const Application = require('../models/Application');
const Counselling = require('../models/Counselling');

const router = express.Router();

function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

router.post('/enroll', async (req, res) => {
  const body = req.body || {};
  if (!body.Full_Name || !body.Email) {
    return res.status(400).json({ detail: 'Full name and email are required.' });
  }
  const record = await Enrollment.create(pick(body, [
    'Full_Name', 'Email', 'Phone_Number', 'Category', 'Course', 'Qualification',
    'Interested_course', 'collegeorlearning_institute', 'prefrred_mode_of_learning',
    'goal', 'Source_Page', 'Context'
  ]));
  res.status(201).json({ message: 'Enrollment recorded.', id: record._id });
});

router.post('/apply', async (req, res) => {
  const body = req.body || {};
  if (!body.Full_Name || !body.Email) {
    return res.status(400).json({ detail: 'Full name and email are required.' });
  }
  const record = await Application.create(pick(body, [
    'Full_Name', 'Email', 'Phone_Number', 'applying_for', 'Qualification',
    'Experience_level', 'prefrred_mode_of_learning', 'goal',
    'Source_Page', 'Context'
  ]));
  res.status(201).json({ message: 'Application recorded.', id: record._id });
});

router.post('/query', async (req, res) => {
  const body = req.body || {};
  if (!body.Full_Name || !body.Email) {
    return res.status(400).json({ detail: 'Full name and email are required.' });
  }
  const record = await Enquiry.create(pick(body, [
    'Full_Name', 'Email', 'Phone_Number', 'Subject', 'Course_Interest', 'message', 'Source_Page'
  ]));
  res.status(201).json({ message: 'Enquiry recorded.', id: record._id });
});

router.post('/book_session', async (req, res) => {
  const body = req.body || {};
  if (!body.Full_Name || !body.Email) {
    return res.status(400).json({ detail: 'Full name and email are required.' });
  }
  const record = await Counselling.create(pick(body, [
    'Full_Name', 'Email', 'Phone_Number', 'Domain_of_interest', 'Source_Page'
  ]));
  res.status(201).json({ message: 'Counselling session booked.', id: record._id });
});

module.exports = router;
