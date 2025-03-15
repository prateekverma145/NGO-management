import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import NotificationPreference from '../models/NotificationPreference';
import mongoose from 'mongoose';

// Get user's notification preferences
export const getUserNotificationPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const preferences = await NotificationPreference.find({ userId })
      .populate('eventId', 'title date time');
    
    res.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification preferences',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update notification preference
export const updateNotificationPreference = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { eventId, enabled } = req.body;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    if (!eventId) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
      return;
    }
    
    // Convert string ID to ObjectId if needed
    const eventObjectId = typeof eventId === 'string' 
      ? new mongoose.Types.ObjectId(eventId) 
      : eventId;
    
    if (enabled) {
      // Create or update preference
      await NotificationPreference.findOneAndUpdate(
        { userId, eventId: eventObjectId },
        { userId, eventId: eventObjectId },
        { upsert: true, new: true }
      );
      
      res.json({
        success: true,
        message: 'Notification preference enabled'
      });
    } else {
      // Remove preference
      await NotificationPreference.findOneAndDelete({ userId, eventId: eventObjectId });
      
      res.json({
        success: true,
        message: 'Notification preference disabled'
      });
    }
  } catch (error) {
    console.error('Error updating notification preference:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification preference',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 