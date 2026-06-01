const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    Full_Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, lowercase: true, trim: true, index: true },
    Phone_Number: { type: String, trim: true, default: '' },
    Category: { type: String, trim: true, default: '' },
    Course: { type: String, trim: true, default: '', index: true },
    Qualification: { type: String, trim: true, default: '' },
    Interested_course: { type: String, trim: true, default: '' },
    collegeorlearning_institute: { type: String, trim: true, default: '' },
    prefrred_mode_of_learning: { type: String, trim: true, default: '' },
    goal: { type: String, trim: true, default: '' },
    Source_Page: { type: String, trim: true, default: '' },
    Context: { type: String, trim: true, default: '' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
