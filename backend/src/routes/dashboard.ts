import express, { Request, Response } from 'express';
import { auth, UserPayload } from '../middleware/auth';
import Donation from '../models/Donation';
import { Event } from '../models/Events';
import { User } from '../models/User';
import mongoose from 'mongoose';
import {
    getDashboardStats as getDashboardStatsController,
    getDonationHistory as getDonationHistoryController,
    getEventHistory as getEventHistoryController
  } from '../controllers/dashboardController';
  

// Extend Request with proper UserPayload
interface AuthRequest extends Request {
  user: UserPayload;  // Note: this is no longer optional
}

// Define response types for better type safety
interface DashboardResponse {
  success: boolean;
  data?: {
    profile: any;
    recentDonations: any[];
    totalDonated: number;
    upcomingEvents: any[];
    impactStats: {
      totalDonations: number;
      eventsJoined: number;
      causesSupported: number;
    };
  };
  message?: string;
}

const router = express.Router();

// Type the request handler properly
const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Get user profile first to verify existence
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const [
      donations,
      totalDonated,
      registeredEvents,
      totalDonations,
      eventsJoined,
      causesSupported
    ] = await Promise.all([
      Donation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5),

      Donation.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      Event.find({
        participants: userId,
        date: { $gte: new Date() }
      })
        .sort({ date: 1 })
        .limit(5),

      Donation.countDocuments({ userId }),
      Event.countDocuments({ participants: userId }),
      Donation.distinct('cause', { userId })
    ]);

    const response: DashboardResponse = {
      success: true,
      data: {
        profile: user,
        recentDonations: donations,
        totalDonated: totalDonated[0]?.total || 0,
        upcomingEvents: registeredEvents,
        impactStats: {
          totalDonations,
          eventsJoined,
          causesSupported: causesSupported.length
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching dashboard data'
    });
  }
};

const getDonationHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const donations = await Donation.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Donation.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Donation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donation history'
    });
  }
};

const getEventHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const events = await Event.find({ participants: userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Event.countDocuments({ participants: userId });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Event history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event history'
    });
  }
};

// Dashboard routes
router.get('/stats', auth, getDashboardStatsController);
router.get('/donations/history', auth, getDonationHistoryController);
router.get('/events/history', auth, getEventHistoryController);

export default router;