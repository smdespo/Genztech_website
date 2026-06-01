const mongoose = require('mongoose');

const counsellingSchema = new mongoose.Schema(
  {
    Full_Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, lowercase: true, trim: true, index: true },
    Phone_Number: { type: String, trim: true, default: '' },
    Domain_of_interest: { type: String, trim: true, default: '' },
    Source_Page: { type: String, trim: true, default: '' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Counselling', counsellingSchema);
