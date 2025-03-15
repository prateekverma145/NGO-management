import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';
import Opportunity from '../models/Opportunity';
import mongoose from 'mongoose';
import { Event } from '../models/Events';
import { sendEventReminder, sendWeeklyEventDigest, sendSameDayEventReminder } from '../utils/emailService';
import { User } from '../models/User';

// Get user's notifications
export const getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    const notifications = await Notification.find({ recipient: userId })
      .populate('relatedOpportunity', 'title date')
      .populate('relatedForumPost', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const notificationId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create opportunity reminder notifications
export const createOpportunityReminders = async (): Promise<void> => {
  try {
    // Find opportunities happening tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const upcomingOpportunities = await Opportunity.find({
      date: tomorrowDateStr,
      status: 'open'
    }).populate('registeredVolunteers');

    // Create notifications for each volunteer
    for (const opportunity of upcomingOpportunities) {
      for (const volunteer of opportunity.registeredVolunteers) {
        await Notification.create({
          recipient: volunteer._id,
          type: 'opportunity_reminder',
          title: 'Upcoming Opportunity Reminder',
          message: `Your registered opportunity "${opportunity.title}" is happening tomorrow!`,
          relatedOpportunity: opportunity._id,
          isRead: false
        });
      }
    }

    console.log(`Created reminders for ${upcomingOpportunities.length} upcoming opportunities`);
  } catch (error) {
    console.error('Error creating opportunity reminders:', error);
  }
};

// Create event reminder notifications
export const createEventReminders = async (): Promise<void> => {
  try {
    // Find events happening tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const upcomingEvents = await Event.find({
      date: tomorrowDateStr
    }).populate('participants');

    // Create notifications for each participant
    for (const event of upcomingEvents) {
      for (const participant of event.participants) {
        // Create in-app notification
        await Notification.create({
          recipient: participant._id,
          type: 'event_reminder',
          title: 'Upcoming Event Reminder',
          message: `Your registered event "${event.title}" is happening tomorrow!`,
          relatedEvent: event._id,
          isRead: false
        });
        
        // Send email notification if participant has email
        if (participant.email) {
          await sendEventReminder(
            participant.email,
            event.title,
            event.date,
            event.time,
            event.location
          );
        }
      }
    }

    console.log(`Created reminders for ${upcomingEvents.length} upcoming events`);
  } catch (error) {
    console.error('Error creating event reminders:', error);
  }
};

// Create a notification
export const createNotification = async (
  recipientId: mongoose.Types.ObjectId,
  type: string,
  title: string,
  message: string,
  relatedOpportunity?: mongoose.Types.ObjectId,
  relatedForumPost?: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      relatedOpportunity,
      relatedForumPost,
      isRead: false
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Create a notification for event registration
export const createEventNotification = async (
  recipientId: mongoose.Types.ObjectId,
  type: string,
  title: string,
  message: string,
  relatedEvent?: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      relatedEvent,
      isRead: false
    });
  } catch (error) {
    console.error('Error creating event notification:', error);
  }
};

// Send weekly event digest to all volunteers
export const sendWeeklyEventDigests = async (): Promise<void> => {
  try {
    // Get all volunteers
    const volunteers = await User.find({ userType: 'volunteer' });
    
    // Get events for the next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const todayStr = today.toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    // Find upcoming events in the next 7 days
    const upcomingEvents = await Event.find({
      date: { $gte: todayStr, $lte: nextWeekStr }
    }).sort({ date: 1 });
    
    if (upcomingEvents.length === 0) {
      console.log('No upcoming events for the next week');
      return;
    }
    
    console.log(`Found ${upcomingEvents.length} upcoming events for the next week`);
    
    // Send digest to each volunteer
    let successCount = 0;
    for (const volunteer of volunteers) {
      if (volunteer.email) {
        try {
          await sendWeeklyEventDigest(volunteer.email, upcomingEvents);
          successCount++;
        } catch (error) {
          console.error(`Error sending digest to ${volunteer.email}:`, error);
        }
      }
    }
    
    console.log(`Successfully sent weekly event digests to ${successCount} volunteers`);
  } catch (error) {
    console.error('Error sending weekly event digests:', error);
  }
};

// Create same-day event reminder notifications
export const createSameDayEventReminders = async (): Promise<void> => {
  try {
    // Find events happening today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const todayEvents = await Event.find({
      date: todayStr
    }).populate('participants');

    if (todayEvents.length === 0) {
      console.log('No events happening today');
      return;
    }
    
    console.log(`Found ${todayEvents.length} events happening today`);
    
    // Create notifications for each participant
    let notificationCount = 0;
    let emailCount = 0;
    
    for (const event of todayEvents) {
      for (const participant of event.participants) {
        // Create in-app notification
        await Notification.create({
          recipient: participant._id,
          type: 'same_day_event_reminder',
          title: 'Event Happening Today!',
          message: `Your registered event "${event.title}" is happening today at ${event.time}!`,
          relatedEvent: event._id,
          isRead: false
        });
        notificationCount++;
        
        // Send email notification if participant has email
        if (participant.email) {
          await sendSameDayEventReminder(
            participant.email,
            event.title,
            event.date,
            event.time,
            event.location
          );
          emailCount++;
        }
      }
    }

    console.log(`Created ${notificationCount} same-day event reminders and sent ${emailCount} emails`);
  } catch (error) {
    console.error('Error creating same-day event reminders:', error);
  }
}; 