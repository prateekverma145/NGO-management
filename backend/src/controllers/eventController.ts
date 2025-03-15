import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Event } from '../models/Events';
import mongoose from 'mongoose';
import { createEventNotification } from './notificationController';
import { sendEventRegistrationConfirmation } from '../utils/emailService';

// Get all events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name organizationName')
      .populate('participants', 'name')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Ensure date is in YYYY-MM-DD format
    const eventData = {
      ...req.body,
      organizer: req.user._id,
      participants: []
    };

    // Validate date format
    if (eventData.date) {
      // Ensure it's in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(eventData.date)) {
        try {
          // Try to convert to YYYY-MM-DD format
          const dateObj = new Date(eventData.date);
          if (!isNaN(dateObj.getTime())) {
            eventData.date = dateObj.toISOString().split('T')[0];
          } else {
            throw new Error('Invalid date format');
          }
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Invalid date format. Please use YYYY-MM-DD format.'
          });
          return;
        }
      }
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Register for an event
export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // const eventId = req.params.id;
    const eventId = req.body.eventId;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const userEmail = req.user.email;

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if user is already registered
    if (event.participants.includes(userId)) {
      res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
      return;
    }

    event.participants.push(userId);
    await event.save();

    // Create notification for the user
    await createEventNotification(
      userId,
      'event_registration',
      'Event Registration Confirmation',
      `You have successfully registered for the event: ${event.title}`,
      event._id
    );

    // Send confirmation email if user has email
    if (userEmail) {
      await sendEventRegistrationConfirmation(
        userEmail,
        event.title,
        event.date,
        event.time,
        event.location
      );
    }

    res.json({
      success: true,
      message: 'Successfully registered for the event',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Unregister from an event
export const unregisterFromEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId: string = req.params.id;
    const userId = new mongoose.Types.ObjectId(req?.user?._id);

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if user is registered
    if (!event.participants.includes(userId)) {
      res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
      return;
    }

    event.participants = event.participants.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== userId.toString()
    );
    await event.save();

    res.json({
      success: true,
      message: 'Successfully unregistered from the event',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Fix the id parameter type in any function that uses it
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;
    
    const event = await Event.findById(id)
      .populate('organizer', 'name organizationName')
      .populate('participants', 'name');

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found'
      });
      return;
    }

    // Check if the current user is registered for this event
    let isRegistered = false;
    if (req.user) {
      const userId = req.user._id.toString();
      isRegistered = event.participants.some((participant: any) => {
        const participantId = typeof participant === 'string' 
          ? participant 
          : participant._id.toString();
        return participantId === userId;
      });
    }

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        isRegistered
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMyEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = req.user._id;
    const status = req.query.status || 'all';
    
    // Base query to find events where the user is a participant
    let query: any = {
      participants: userId
    };

    // Add date filtering based on status
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (status === 'upcoming') {
      query.date = { $gte: today };
    } else if (status === 'past') {
      query.date = { $lt: today };
    }

    // Find events and populate organizer details
    const events = await Event.find(query)
      .populate('organizer', 'name organizationName')
      .sort({ date: status === 'past' ? -1 : 1 }) // Sort by date (ascending for upcoming, descending for past)
      .lean();

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registered events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 