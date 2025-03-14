import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllEvents,
  createEvent,
  registerForEvent,
  unregisterFromEvent
} from '../controllers/eventController';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);

// Protected routes
router.post('/', auth, createEvent);
router.post('/:id/register', auth, registerForEvent);
router.post('/:id/unregister', auth, unregisterFromEvent);

export default router; 