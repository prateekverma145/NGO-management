import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import express from 'express';
import { signup, signin, verifyToken, verifyOTP, resendOTP } from '../controllers/authController';
import { auth } from '../middleware/auth';

export interface UserPayload {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  name: string;
  userType: 'ngo' | 'volunteer';
}

export interface AuthRequest extends Request {
  user: UserPayload;
}

const router = express.Router();

// Public routes
router.post('/signup', signup as any);
router.post('/signin', signin as any);
router.post('/verify-otp', verifyOTP as any);
router.post('/resend-otp', resendOTP as any);

// Protected routes
router.get('/verify-token', auth, verifyToken as any);

export default router;