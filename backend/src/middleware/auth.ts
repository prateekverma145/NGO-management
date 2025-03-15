import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';

export interface UserPayload {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  name: string;
  userType: 'ngo' | 'volunteer';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};