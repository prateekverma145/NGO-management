import express from 'express';
import { getNearbyLocations, addLocation, seedSampleLocations } from '../controllers/locationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/nearby', async (req, res) => {
  try {
    await getNearbyLocations(req, res);
  } catch (error) {
    console.error('Error in nearby locations route:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Protected routes (require authentication)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    await addLocation(req, res);
  } catch (error) {
    console.error('Error in add location route:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/seed', authenticateToken, async (req, res) => {
  try {
    await seedSampleLocations(req, res);
  } catch (error) {
    console.error('Error in seed locations route:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router; 