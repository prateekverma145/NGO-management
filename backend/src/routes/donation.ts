import express from 'express';
import { auth } from '../middleware/auth';
import { validateDonation } from '../middleware/validation';
import { 
  createDonation, 
  getDonationHistory, 
  getReceivedDonations, 
  getNGOList 
} from '../controllers/donationController';

const router = express.Router();

// Create a new donation
router.post('/create', auth, validateDonation, createDonation);

// Get user's donation history
router.get('/history', auth, getDonationHistory);

// Get received donations with pagination and filtering
router.get('/received', auth, getReceivedDonations);

// Get list of NGOs for donation
router.get('/ngos', auth, getNGOList);

export default router;