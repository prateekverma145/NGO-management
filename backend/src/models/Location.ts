import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  type: 'ngo' | 'food_bank' | 'blood_bank' | 'shelter';
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['ngo', 'food_bank', 'blood_bank', 'shelter']
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String
  }
}, {
  timestamps: true
});

// Create a 2dsphere index for geospatial queries
LocationSchema.index({ coordinates: '2dsphere' });

export default mongoose.model<ILocation>('Location', LocationSchema); 