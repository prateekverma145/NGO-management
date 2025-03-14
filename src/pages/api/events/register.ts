import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/mongodb';
import { Event } from '../../../backend/src/models/Events';
import { EventRegistration } from '../../../models/EventRegistration';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const {
      eventId,
      fullName,
      email,
      phone,
      age,
      emergencyContact,
      specialRequirements,
    } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check for existing registration
    const existingRegistration = await EventRegistration.findOne({
      eventId,
      email,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Create registration
    const registration = await EventRegistration.create({
      eventId,
      fullName,
      email,
      phone,
      age,
      emergencyContact,
      specialRequirements,
    });

    // Update participant count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { participants: 1 }
    });

    return res.status(201).json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}