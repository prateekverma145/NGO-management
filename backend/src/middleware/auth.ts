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

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ _id: (decoded as any)._id });

    if (!user) {
      throw new Error();
    }

    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};