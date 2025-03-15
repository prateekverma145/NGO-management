import express from 'express';
import { auth } from '../middleware/auth';
import { 
  getUserNotificationPreferences, 
  updateNotificationPreference 
} from '../controllers/notificationPreferenceController';

const router = express.Router();

// User profile routes can be added here

// Notification preferences
router.get('/notification-preferences', auth, getUserNotificationPreferences);
router.post('/notification-preferences', auth, updateNotificationPreference);

export default router; 