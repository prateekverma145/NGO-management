import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from './auth';

// Middleware to verify admin authentication
export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as any;
    
    // Find user by id
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if user is an admin
    if (user.userType !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
      return;
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token, access denied',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 