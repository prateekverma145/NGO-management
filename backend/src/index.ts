import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Request, Response } from "express";
import donationRoutes from './routes/donation';
import dashboardRoutes from './routes/dashboard';
import opportunityRoutes from './routes/opportunity';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import forumRoutes from './routes/forum';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/users';
import { createOpportunityReminders } from './controllers/notificationController';
import { startScheduler } from './utils/scheduler';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Test endpoint to echo back the request body
app.post('/api/test-echo', (req, res) => {
    console.log('Test echo endpoint received:', req.body);
    res.json({
        success: true,
        message: 'Echo test',
        receivedData: req.body,
        contentType: req.headers['content-type']
    });
});

// Test endpoint for opportunity creation
app.post('/api/test-opportunity', (req, res) => {
    console.log('Test opportunity endpoint received:', req.body);
    
    // Check required fields
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
    
    const hasMissingFields = Object.values(missingFields).some(value => value === true);
    
    res.json({
        success: !hasMissingFields,
        message: hasMissingFields ? 'Missing required fields' : 'All required fields present',
        missingFields,
        receivedData: req.body,
        contentType: req.headers['content-type']
    });
});

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Set up notification scheduler
const setupNotificationScheduler = () => {
    // Use the new scheduler utility instead of manual scheduling
    startScheduler();
    console.log('Notification scheduler set up');
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/volunteer-db')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    // Start the notification scheduler
    setupNotificationScheduler();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});