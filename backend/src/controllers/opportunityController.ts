import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Opportunity from '../models/Opportunity';
import mongoose from 'mongoose';

// Create new opportunity
export const createOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is an NGO
    if (req.user.userType !== 'ngo') {
      res.status(403).json({
        success: false,
        message: 'Only NGOs can create opportunities'
      });
      return;
    }

    // Debug: Log the request body and headers to see what's being received
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Authorization:', req.headers['authorization'] ? 'Present' : 'Missing');
    
    // Extract and validate required fields
    const { 
      title, 
      organization, 
      location, 
      date, 
      image, 
      category, 
      volunteers, 
      description, 
      hoursPerWeek, 
      deadline, 
      impact 
    } = req.body;

    // Debug: Log each field individually
    console.log('Field values:', {
      title,
      organization,
      location,
      date,
      image,
      category,
      volunteers,
      description,
      hoursPerWeek,
      deadline,
      impact
    });

    // Create an object to track missing fields
    const missingFields = {
      title: !title,
      organization: !organization,
      location: !location,
      date: !date,
      image: !image,
      category: !category,
      volunteers: !volunteers,
      description: !description,
      hoursPerWeek: !hoursPerWeek,
      deadline: !deadline,
      impact: !impact
    };

    // Check if any required fields are missing
    const hasMissingFields = Object.values(missingFields).some(value => value === true);
    
    if (hasMissingFields) {
      console.log('Missing required fields:', missingFields);
      
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields,
        receivedData: req.body
      });
      return;
    }

    // Create the opportunity with explicit field assignment to ensure all fields are included
    const opportunityData = {
      title,
      organization,
      location,
      date,
      image,
      category,
      volunteers: Number(volunteers),
      description,
      hoursPerWeek: String(hoursPerWeek),
      deadline: String(deadline),
      impact: String(impact),
      createdBy: req.user._id,
      registeredVolunteers: [],
      status: 'open'
    };

    console.log('Creating opportunity with data:', opportunityData);

    const opportunity = new Opportunity(opportunityData);

    await opportunity.save();

    res.status(201).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    
    // Provide more detailed error messages for validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = {};
      
      // @ts-ignore - Mongoose validation error structure
      if (error.errors) {
        // @ts-ignore - Mongoose validation error structure
        Object.keys(error.errors).forEach(key => {
          // @ts-ignore - Mongoose validation error structure
          validationErrors[key] = error.errors[key].message;
        });
      }
      
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
        receivedData: req.body
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating opportunity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Register for an opportunity
export const registerForOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is a volunteer
    if (req.user.userType !== 'volunteer') {
      res.status(403).json({
        success: false,
        message: 'Only volunteers can register for opportunities'
      });
      return;
    }

    const opportunityId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
      return;
    }

    // Check if opportunity is closed
    if (opportunity.status === 'closed') {
      res.status(400).json({
        success: false,
        message: 'This opportunity is no longer accepting volunteers'
      });
      return;
    }

    // Check if deadline has passed
    const deadlineDate = new Date(opportunity.deadline);
    if (deadlineDate < new Date()) {
      res.status(400).json({
        success: false,
        message: 'Registration deadline has passed for this opportunity'
      });
      return;
    }

    // Check if user is already registered
    if (opportunity.registeredVolunteers.includes(userId)) {
      res.status(400).json({
        success: false,
        message: 'You are already registered for this opportunity'
      });
      return;
    }

    // Register volunteer using the model method
    const registered = await opportunity.registerVolunteer(userId);

    if (!registered) {
      res.status(400).json({
        success: false,
        message: 'Unable to register - opportunity might be full'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Successfully registered for the opportunity',
      data: {
        opportunityId: opportunity._id,
        availableSpots: opportunity.availableSpots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering for opportunity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Unregister from an opportunity
export const unregisterFromOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const opportunityId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
      return;
    }

    const unregistered = await opportunity.unregisterVolunteer(userId);

    if (!unregistered) {
      res.status(400).json({
        success: false,
        message: 'You are not registered for this opportunity'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Successfully unregistered from the opportunity',
      data: {
        opportunityId: opportunity._id,
        availableSpots: opportunity.availableSpots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unregistering from opportunity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all opportunities
export const getAllOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    // Only show open opportunities with deadlines in the future
    const currentDate = new Date();
    
    const opportunities = await Opportunity.find({
      status: 'open',
      deadline: { $gte: currentDate.toISOString().split('T')[0] } // Compare with YYYY-MM-DD format
    })
      .populate('createdBy', 'name email organizationName')
      .populate('registeredVolunteers', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get opportunities created by the logged-in user
export const getMyOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const opportunities = await Opportunity.find({ createdBy: req.user._id })
      .populate('registeredVolunteers', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your opportunities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get opportunities user has registered for
export const getRegisteredOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const opportunities = await Opportunity.find({
      registeredVolunteers: req.user._id
    })
      .populate('createdBy', 'name email organizationName')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registered opportunities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single opportunity details
export const getOpportunityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('createdBy', 'name email organizationName')
      .populate('registeredVolunteers', 'name email');

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
      return;
    }

    res.json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunity details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};