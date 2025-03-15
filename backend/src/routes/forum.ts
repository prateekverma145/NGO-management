import express from 'express';
import { auth } from '../middleware/auth';
import {
  createForumPost,
  getAllForumPosts,
  getOpportunityForumPosts,
  getForumPostById,
  addReplyToPost,
  updateForumPost
} from '../controllers/forumController';

const router = express.Router();

// Public routes
router.get('/', getAllForumPosts);
router.get('/opportunity/:opportunityId', getOpportunityForumPosts);
router.get('/:id', getForumPostById);

// Protected routes
router.post('/', auth, createForumPost);
router.post('/:id/reply', auth, addReplyToPost);
router.put('/:id', auth, updateForumPost);

export default router; 