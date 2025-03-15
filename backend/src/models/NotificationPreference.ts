import mongoose from 'mongoose';

const notificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only have one preference per event
notificationPreferenceSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const NotificationPreference = mongoose.models.NotificationPreference || 
  mongoose.model('NotificationPreference', notificationPreferenceSchema);

export default NotificationPreference; 