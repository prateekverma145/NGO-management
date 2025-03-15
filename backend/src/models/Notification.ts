import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'opportunity_reminder', 
      'forum_reply', 
      'registration_confirmation', 
      'system', 
      'event_reminder', 
      'event_registration',
      'same_day_event_reminder'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedOpportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  relatedForumPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  },
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 