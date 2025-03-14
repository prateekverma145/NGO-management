import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  cause: {
    type: String,
    required: true,
    enum: ['education', 'healthcare', 'environment', 'elderly', 'disaster']
  },
  message: {
    type: String,
    required: false
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'netbanking']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Donation', donationSchema);