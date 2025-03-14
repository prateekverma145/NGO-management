import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Event } from '../models/Events';
import mongoose from 'mongoose';

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
    const event = new Event({
      ...req.body,
      organizer: req.user._id,
      participants: []
    });

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
    const eventId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.user._id);

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
    const eventId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.user._id);

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
      (id) => id.toString() !== userId.toString()
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