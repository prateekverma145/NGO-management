import express from 'express';
import { auth } from '../middleware/auth';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  sendWeeklyEventDigests,
  createSameDayEventReminders
} from '../controllers/notificationController';
import { adminAuth } from '../middleware/adminAuth';
import { Event } from '../models/Events';
import { sendWeeklyEventDigest, sendSameDayEventReminder } from '../utils/emailService';
import Notification from '../models/Notification';

const router = express.Router();

// All routes are protected
router.get('/', auth, getUserNotifications);
router.put('/:id/read', auth, markNotificationAsRead);
router.put('/read-all', auth, markAllNotificationsAsRead);

// Admin routes
router.post('/send-weekly-digest', adminAuth, async (req, res) => {
  try {
    await sendWeeklyEventDigests();
    res.json({
      success: true,
      message: 'Weekly event digest sent successfully'
    });
  } catch (error) {
    console.error('Error sending weekly digest:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending weekly digest',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/send-same-day-reminders', adminAuth, async (req, res) => {
  try {
    await createSameDayEventReminders();
    res.json({
      success: true,
      message: 'Same-day event reminders sent successfully'
    });
  } catch (error) {
    console.error('Error sending same-day reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending same-day reminders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// User routes
router.post('/request-digest', auth, async (req: any, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Check if user is a volunteer
    if (req.user.userType !== 'volunteer') {
      res.status(403).json({
        success: false,
        message: 'Only volunteers can request event digests'
      });
      return;
    }

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
      res.json({
        success: true,
        message: 'No upcoming events for the next week'
      });
      return;
    }
    
    // Send digest to the requesting volunteer
    if (req.user.email) {
      await sendWeeklyEventDigest(req.user.email, upcomingEvents);
      res.json({
        success: true,
        message: 'Event digest sent to your email'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No email address found for your account'
      });
    }
  } catch (error) {
    console.error('Error sending digest to user:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending event digest',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/request-today-reminders', auth, async (req: any, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Find events happening today that the user is registered for
    const todayEvents = await Event.find({
      date: todayStr,
      participants: req.user._id
    });
    
    if (todayEvents.length === 0) {
      res.json({
        success: true,
        message: 'You have no events scheduled for today'
      });
      return;
    }
    
    // Send email reminders for each event
    let emailCount = 0;
    for (const event of todayEvents) {
      if (req.user.email) {
        await sendSameDayEventReminder(
          req.user.email,
          event.title,
          event.date,
          event.time,
          event.location
        );
        emailCount++;
        
        // Create in-app notification
        await Notification.create({
          recipient: req.user._id,
          type: 'same_day_event_reminder',
          title: 'Event Happening Today!',
          message: `Your registered event "${event.title}" is happening today at ${event.time}!`,
          relatedEvent: event._id,
          isRead: false
        });
      }
    }
    
    if (emailCount > 0) {
      res.json({
        success: true,
        message: `Sent reminders for ${emailCount} events happening today`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No email address found for your account'
      });
    }
  } catch (error) {
    console.error('Error sending today\'s event reminders to user:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending today\'s event reminders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 