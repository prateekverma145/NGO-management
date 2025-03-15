import { Request, Response } from 'express';
import Location from '../models/Location';

// Get nearby locations within a specified radius (in kilometers)
export const getNearbyLocations = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 5, type = 'all' } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Convert radius from kilometers to meters
    const radiusInMeters = Number(radius) * 1000;

    // Base query for geospatial search
    const baseQuery = {
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      }
    };

    // Add type filter if specified
    const query = type !== 'all' ? { ...baseQuery, type } : baseQuery;

    const locations = await Location.find(query);

    return res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching nearby locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching nearby locations'
    });
  }
};

// Add a new location
export const addLocation = async (req: Request, res: Response) => {
  try {
    const { name, type, latitude, longitude, address, contact } = req.body;

    const location = new Location({
      name,
      type,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      address,
      contact
    });

    await location.save();

    return res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error adding location:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding location'
    });
  }
};

// Seed sample locations
export const seedSampleLocations = async (req: Request, res: Response) => {
  try {
    const sampleLocations = [
      {
        name: 'Hope Foundation NGO',
        type: 'ngo',
        coordinates: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        },
        address: '123 Main St, Bangalore',
        contact: '+91 9876543210'
      },
      {
        name: 'City Food Bank',
        type: 'food_bank',
        coordinates: {
          type: 'Point',
          coordinates: [77.5906, 12.9796]
        },
        address: '456 Church St, Bangalore',
        contact: '+91 9876543211'
      },
      {
        name: 'Life Blood Bank',
        type: 'blood_bank',
        coordinates: {
          type: 'Point',
          coordinates: [77.6046, 12.9716]
        },
        address: '789 Hospital Rd, Bangalore',
        contact: '+91 9876543212'
      },
      {
        name: 'Safe Haven Shelter',
        type: 'shelter',
        coordinates: {
          type: 'Point',
          coordinates: [77.5846, 12.9746]
        },
        address: '321 Shelter Ave, Bangalore',
        contact: '+91 9876543213'
      }
    ];

    await Location.insertMany(sampleLocations);

    return res.status(200).json({
      success: true,
      message: 'Sample locations seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Error seeding locations'
    });
  }
}; 