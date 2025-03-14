import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UserPayload } from '../middleware/auth';
import mongoose from 'mongoose';
import { generateOTP, sendOTPEmail } from '../utils/emailService';

// Define the expected request body types
interface SignupRequest {
  userType: 'ngo' | 'volunteer';
  email: string;
  password: string;
  name: string;
  organizationName?: string;
  registrationNumber?: string;
  address?: string;
  website?: string;
  phone?: string;
  skills?: string[];
  interests?: string[];
}

interface SigninRequest {
  email: string;
  password: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export const signup = async (req: Request<{}, {}, SignupRequest>, res: Response) => {
  try {
    const {
      userType,
      email,
      password,
      name,
      organizationName,
      registrationNumber,
      address,
      website,
      phone,
      skills,
      interests,
    } = req.body;

    // Validate required fields
    if (!email || !password || !name || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user based on type
    const user = await User.create({
      userType,
      email,
      password: hashedPassword,
      name,
      otp: {
        code: otp,
        expiresAt: otpExpiresAt
      },
      ...(userType === 'ngo' && {
        organizationName,
        registrationNumber,
        address,
        website,
      }),
      ...(userType === 'volunteer' && {
        phone,
        skills,
        interests,
      }),
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      // Don't fail the signup if email fails
    }

    // Create user payload for token
    const userPayload: UserPayload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType
    };

    // Generate token
    const token = jwt.sign(
      userPayload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please verify your email.',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const verifyOTP = async (req: Request<{}, {}, VerifyOTPRequest>, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found or OTP expired'
      });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const resendOTP = async (req: Request<{}, {}, { email: string }>, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user's OTP
    user.otp = {
      code: otp,
      expiresAt: otpExpiresAt
    };
    await user.save();

    // Send new OTP email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: 'New OTP sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const signin = async (req: Request<{}, {}, SigninRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    console.log(email, password)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and populate necessary fields
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create user payload for token
    const userPayload: UserPayload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType
    };

    // Generate token
    const token = jwt.sign(
      userPayload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error signing in',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add a utility function to verify token
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as UserPayload;

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};