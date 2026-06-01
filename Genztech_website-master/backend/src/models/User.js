const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    Full_Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    Phone_Number: { type: String, trim: true, default: '' },
    Course: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.methods.toPublicJSON = function () {
  return {
    fullName: this.Full_Name,
    email: this.Email,
    phone: this.Phone_Number,
    course: this.Course
  };
};

module.exports = mongoose.model('User', userSchema);
