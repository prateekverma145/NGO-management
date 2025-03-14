import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Donation from '../models/Donation';
import { Event } from '../models/Events';
import { User } from '../models/User';

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

// Update return type to Promise<void>
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
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
        .limit(5)
        .populate('organizer', 'name organizationName')
        .populate('participants', 'name'),
      Donation.countDocuments({ userId }),
      Event.countDocuments({ participants: userId }),
      Donation.distinct('cause', { userId })
    ]);

    const response: DashboardResponse = {
      success: true,
      data: {
        profile: user,
        recentDonations: donations || [],
        totalDonated: totalDonated[0]?.total || 0,
        upcomingEvents: registeredEvents || [],
        impactStats: {
          totalDonations: totalDonations || 0,
          eventsJoined: eventsJoined || 0,
          causesSupported: causesSupported?.length || 0
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

export const getDonationHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const query: any = { userId };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const [donations, total] = await Promise.all([
      Donation.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('cause', 'name'),
      Donation.countDocuments(query)
    ]);

    const stats = await Donation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
          maxAmount: { $max: "$amount" },
          minAmount: { $min: "$amount" }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        donations,
        stats: stats[0] || {
          totalAmount: 0,
          averageAmount: 0,
          maxAmount: 0,
          minAmount: 0
        },
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          hasMore: page * limit < total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donation history'
    });
  }
};

export const getEventHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as 'upcoming' | 'past' | 'all' || 'all';

    const query: any = { participants: userId };
    const currentDate = new Date();

    if (status === 'upcoming') {
      query.date = { $gte: currentDate };
    } else if (status === 'past') {
      query.date = { $lt: currentDate };
    }

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ date: status === 'past' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('organizer', 'name organizationName')
        .populate('participants', 'name'),
      Event.countDocuments(query)
    ]);

    const stats = {
      upcoming: await Event.countDocuments({
        participants: userId,
        date: { $gte: currentDate }
      }),
      past: await Event.countDocuments({
        participants: userId,
        date: { $lt: currentDate }
      })
    };

    res.json({
      success: true,
      data: {
        events,
        stats,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          hasMore: page * limit < total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event history'
    });
  }
};