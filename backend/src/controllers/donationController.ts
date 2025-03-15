import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Donation from '../models/Donation';
import { User } from '../models/User';

// Create a new donation
export const createDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, cause, message, paymentMethod, recipientId } = req.body;
    
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Validate that recipientId is provided
    if (!recipientId) {
      res.status(400).json({
        success: false,
        message: 'Recipient NGO ID is required'
      });
      return;
    }

    // Prevent NGOs from donating to themselves
    if (req.user.userType === 'ngo' && req.user._id.toString() === recipientId) {
      res.status(400).json({
        success: false,
        message: 'NGOs cannot donate to themselves'
      });
      return;
    }

    // Verify that the recipient exists and is an NGO
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({
        success: false,
        message: 'Recipient NGO not found'
      });
      return;
    }

    if (recipient.userType !== 'ngo') {
      res.status(400).json({
        success: false,
        message: 'Recipient must be an NGO'
      });
      return;
    }

    console.log('Creating donation with user ID:', req.user._id, 'to NGO:', recipientId);
    
    const donation = new Donation({
      userId: req.user._id,
      recipientId: recipientId,
      recipientName: recipient.organizationName || recipient.name,
      amount,
      cause,
      message,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN${Date.now()}`
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      donation
    });
  } catch (error) {
    console.error('Donation processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing donation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get donation history for a volunteer
 * @route GET /api/donations/history
 * @access Private (Volunteer only)
 */
export const getDonationHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Check if user is a volunteer
    if (req.user?.userType !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only volunteers can view their donation history'
      });
    }
    
    // Find all donations made by this user
    const donations = await Donation.find({ userId })
      .populate('recipientId', 'name organizationName description')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      donations
    });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching donation history'
    });
  }
};

// Get received donations with pagination and filtering for NGOs
export const getReceivedDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Check if user is an NGO
    if (req.user.userType !== 'ngo') {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only NGOs can view received donations.' 
      });
      return;
    }

    const ngoId = new mongoose.Types.ObjectId(req.user._id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string === 'asc' ? 1 : -1;

    // Build query
    const query: any = { recipientId: ngoId };
    
    // Add date range if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    console.log('Fetching donations for NGO:', ngoId, 'with query:', query);

    // Get donations with pagination
    const [donations, total] = await Promise.all([
      Donation.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email'),
      Donation.countDocuments(query)
    ]);

    console.log(`Found ${donations.length} donations out of ${total} total`);

    // Get donation statistics
    const stats = await Donation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
          maxAmount: { $max: "$amount" },
          minAmount: { $min: "$amount" },
          donorCount: { $addToSet: "$userId" }
        }
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          averageAmount: 1,
          maxAmount: 1,
          minAmount: 1,
          uniqueDonors: { $size: "$donorCount" }
        }
      }
    ]);

    // Get donation trends by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Donation.aggregate([
      { 
        $match: { 
          recipientId: ngoId,
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Get donation distribution by cause
    const causeDistribution = await Donation.aggregate([
      { $match: { recipientId: ngoId } },
      {
        $group: {
          _id: "$cause",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        donations,
        stats: stats[0] || {
          totalAmount: 0,
          averageAmount: 0,
          maxAmount: 0,
          minAmount: 0,
          uniqueDonors: 0
        },
        trends: {
          monthly: monthlyTrends,
          byCause: causeDistribution
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
    console.error('Error fetching received donations:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching received donations'
    });
  }
};

// Get list of NGOs for donation
export const getNGOList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ngos = await User.find({ userType: 'ngo' })
      .select('_id name organizationName description');

    res.json({
      success: true,
      ngos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO list',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 