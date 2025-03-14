import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: ['volunteer', 'ngo'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // NGO specific fields
  organizationName: String,
  registrationNumber: String,
  address: String,
  website: String,
  // Volunteer specific fields
  phone: String,
  skills: String,
  interests: [String],
  // OTP fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);