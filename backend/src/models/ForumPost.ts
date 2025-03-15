import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedOpportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  replies: [replySchema],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
forumPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export default ForumPost; 