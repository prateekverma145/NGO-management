import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ForumPost from '../models/ForumPost';
import mongoose from 'mongoose';

// Create a new forum post
export const createForumPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, relatedOpportunity, tags } = req.body;

    const post = new ForumPost({
      title,
      content,
      author: req.user._id,
      relatedOpportunity,
      tags: tags || [],
      replies: []
    });

    await post.save();

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating forum post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all forum posts
export const getAllForumPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'name email userType organizationName')
      .populate({
        path: 'relatedOpportunity',
        select: 'title',
        // Handle the case when the opportunity doesn't exist
        match: { _id: { $exists: true } }
      })
      .populate('replies.author', 'name email userType organizationName')
      .sort({ updatedAt: -1 });

    // Filter out any null relatedOpportunity fields (in case the opportunity was deleted)
    const processedPosts = posts.map(post => {
      // Convert to plain object to avoid mongoose document issues
      const postObj = post.toObject();
      
      // If relatedOpportunity is null, set it to undefined
      if (postObj.relatedOpportunity === null) {
        postObj.relatedOpportunity = undefined;
      }
      
      return postObj;
    });

    res.json({
      success: true,
      data: processedPosts
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forum posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get forum posts related to a specific opportunity
export const getOpportunityForumPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunityId = req.params.opportunityId;
    
    const posts = await ForumPost.find({ relatedOpportunity: opportunityId })
      .populate('author', 'name email userType organizationName')
      .populate({
        path: 'relatedOpportunity',
        select: 'title',
        match: { _id: { $exists: true } }
      })
      .populate('replies.author', 'name email userType organizationName')
      .sort({ updatedAt: -1 });

    // Process posts to handle null relatedOpportunity
    const processedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (postObj.relatedOpportunity === null) {
        postObj.relatedOpportunity = undefined;
      }
      return postObj;
    });

    res.json({
      success: true,
      data: processedPosts
    });
  } catch (error) {
    console.error('Error fetching opportunity forum posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunity forum posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a single forum post by ID
export const getForumPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    
    const post = await ForumPost.findById(postId)
      .populate('author', 'name email userType organizationName')
      .populate({
        path: 'relatedOpportunity',
        select: 'title',
        match: { _id: { $exists: true } }
      })
      .populate('replies.author', 'name email userType organizationName');

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
      return;
    }

    // Process post to handle null relatedOpportunity
    const processedPost = post.toObject();
    if (processedPost.relatedOpportunity === null) {
      processedPost.relatedOpportunity = undefined;
    }

    res.json({
      success: true,
      data: processedPost
    });
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forum post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add a reply to a forum post
export const addReplyToPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
      return;
    }

    const post = await ForumPost.findById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
      return;
    }

    const reply = {
      content,
      author: req.user._id,
      createdAt: new Date()
    };

    post.replies.push(reply);
    post.updatedAt = new Date();
    await post.save();

    // Populate the newly added reply
    const updatedPost = await ForumPost.findById(postId)
      .populate('author', 'name email userType organizationName')
      .populate({
        path: 'relatedOpportunity',
        select: 'title',
        match: { _id: { $exists: true } }
      })
      .populate('replies.author', 'name email userType organizationName');

    if (!updatedPost) {
      res.status(404).json({
        success: false,
        message: 'Forum post not found after update'
      });
      return;
    }

    // Process post to handle null relatedOpportunity
    const processedPost = updatedPost.toObject();
    if (processedPost.relatedOpportunity === null) {
      processedPost.relatedOpportunity = undefined;
    }

    res.json({
      success: true,
      data: processedPost
    });
  } catch (error) {
    console.error('Error adding reply to forum post:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply to forum post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update a forum post
export const updateForumPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { title, content, tags } = req.body;

    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
      return;
    }

    // Find the post
    const post = await ForumPost.findById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
      return;
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post'
      });
      return;
    }

    // Update the post
    post.title = title;
    post.content = content;
    post.tags = tags || [];
    post.updatedAt = new Date();

    await post.save();

    // Get the updated post with populated fields
    const updatedPost = await ForumPost.findById(postId)
      .populate('author', 'name email userType organizationName')
      .populate({
        path: 'relatedOpportunity',
        select: 'title',
        match: { _id: { $exists: true } }
      })
      .populate('replies.author', 'name email userType organizationName');

    if (!updatedPost) {
      res.status(404).json({
        success: false,
        message: 'Forum post not found after update'
      });
      return;
    }

    // Process post to handle null relatedOpportunity
    const processedPost = updatedPost.toObject();
    if (processedPost.relatedOpportunity === null) {
      processedPost.relatedOpportunity = undefined;
    }

    res.json({
      success: true,
      data: processedPost
    });
  } catch (error) {
    console.error('Error updating forum post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating forum post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 