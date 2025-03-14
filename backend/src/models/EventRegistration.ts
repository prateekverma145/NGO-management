import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  emergencyContact: { type: String, required: true },
  specialRequirements: String,
  status: { type: String, default: 'CONFIRMED' },
}, { timestamps: true });

export const EventRegistration = mongoose.models.EventRegistration || 
  mongoose.model('EventRegistration', eventRegistrationSchema);