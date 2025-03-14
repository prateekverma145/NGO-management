import express from 'express';
import { auth } from '../middleware/auth';
import Donation from '../models/Donation';
import { validateDonation } from '../middleware/validation';


const router = express.Router();

// Create a new donation

router.post('/create', auth, validateDonation, async (req, res) => {
  try {
    const { amount, cause, message, paymentMethod } = req.body;
    
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('Creating donation with user ID:', req.user._id);
    
    const donation = new Donation({
      userId: req.user._id, // This should now be properly set
      amount,
      cause,
      message,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN${Date.now()}`
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      donation
    });
  } catch (error) {
    console.error('Donation processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing donation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's donation history
router.get('/history', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donation history',
      error: error.message
    });
  }
});

export default router;