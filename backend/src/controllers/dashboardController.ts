import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Donation from '../models/Donation';
import { Event } from '../models/Events';
import { User } from '../models/User';
import Opportunity from '../models/Opportunity';

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

export const getVolunteerDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = req.user._id;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    // Get upcoming events (events the volunteer has registered for with dates >= today)
    const upcomingEvents = await Event.find({
      participants: userId,
      date: { $gte: todayStr }
    })
      .populate('organizer', 'name organizationName')
      .sort({ date: 1 })
      .limit(5);

    // Check if user is a volunteer
    if (req.user.userType !== 'volunteer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. User is not a volunteer'
      });
      return;
    }

    // Get user profile
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get registered opportunities
    const registeredOpportunities = await Opportunity.find({
      registeredVolunteers: userId
    }).populate('createdBy', 'name organizationName');

    // Get upcoming opportunities (with future deadlines)
    const upcomingOpportunities = registeredOpportunities.filter(
      opp => new Date(opp.deadline) > new Date()
    );

    // Get recent donations
    const recentDonations = await Donation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total donation amount
    const totalDonationResult = await Donation.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalDonated = totalDonationResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        profile: user,
        stats: {
          opportunitiesJoined: registeredOpportunities.length,
          upcomingOpportunities: upcomingOpportunities.length,
          totalDonated: totalDonated,
          upcomingEvents: upcomingEvents.length
        },
        recentDonations: recentDonations,
        upcomingEvents: upcomingEvents,
        registeredOpportunities: registeredOpportunities
      }
    });
  } catch (error) {
    console.error('Volunteer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching volunteer dashboard data'
    });
  }
};

export const getNGODashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = req.user._id;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    // Get upcoming events organized by this NGO with dates >= today
    const upcomingEvents = await Event.find({
      organizer: userId,
      date: { $gte: todayStr }
    })
      .sort({ date: 1 })
      .limit(5);

    // Check if user is an NGO
    if (req.user.userType !== 'ngo') {
      res.status(403).json({
        success: false,
        message: 'Access denied. User is not an NGO'
      });
      return;
    }

    // Get user profile
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get all opportunities created by this NGO
    const allOpportunities = await Opportunity.find({ createdBy: userId });

    // Count live (open) opportunities
    const liveOpportunities = allOpportunities.filter(opp => opp.status === 'open');
    
    // Count closed opportunities
    const closedOpportunities = allOpportunities.filter(opp => opp.status === 'closed');

    // Count total registered volunteers across all opportunities
    const totalVolunteers = allOpportunities.reduce(
      (total, opp) => total + (opp.registeredVolunteers?.length || 0), 
      0
    );

    // Get total donations received by this NGO
    const donationsResult = await Donation.aggregate([
      { $match: { recipientId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalDonationsReceived = donationsResult[0]?.total || 0;

    // Get recent donations received
    const recentDonations = await Donation.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name');

    res.json({
      success: true,
      data: {
        profile: user,
        stats: {
          totalOpportunities: allOpportunities.length,
          liveOpportunities: liveOpportunities.length,
          closedOpportunities: closedOpportunities.length,
          totalVolunteers: totalVolunteers,
          totalDonationsReceived: totalDonationsReceived
        },
        recentDonations: recentDonations,
        upcomingEvents: upcomingEvents,
        opportunities: {
          live: liveOpportunities.slice(0, 5), // Limit to 5 for the dashboard
          closed: closedOpportunities.slice(0, 5) // Limit to 5 for the dashboard
        }
      }
    });
  } catch (error) {
    console.error('NGO dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching NGO dashboard data'
    });
  }
};