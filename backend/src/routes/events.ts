import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllEvents,
  createEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventById,
  getMyEvents
} from '../controllers/eventController';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);

// Protected routes
router.post('/', auth, createEvent);
router.post('/register', auth, registerForEvent);
router.get('/my-events', auth, getMyEvents);

// Routes with parameters (must come after specific routes)
router.get('/:id', getEventById);
router.post('/:id/unregister', auth, unregisterFromEvent);

export default router; 