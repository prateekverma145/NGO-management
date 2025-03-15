import mongoose, { Document } from 'mongoose';

// Define methods interface separately for better organization
interface IOpportunityMethods {
  isFull(): boolean;
  registerVolunteer(userId: mongoose.Types.ObjectId): Promise<boolean>;
  unregisterVolunteer(userId: mongoose.Types.ObjectId): Promise<boolean>;
}

// Main interface extending both Document and methods
export interface IOpportunity extends Document, IOpportunityMethods {
  title: string;
  organization: string;
  location: string;
  date: string;
  image: string;
  category: string;
  volunteers: number;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  registeredVolunteers: mongoose.Types.ObjectId[];
  hoursPerWeek: string;
  deadline: string;
  impact: string;
  status: 'open' | 'closed';
  availableSpots: number; // Add virtual field to interface
}

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Food & Hunger', 'Environment', 'Education', 'Healthcare', 'Social Services']
  },
  volunteers: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  registeredVolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hoursPerWeek: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  impact: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
});

// Add virtual field for available spots
opportunitySchema.virtual('availableSpots').get(function(this: IOpportunity) {
  // Check if registeredVolunteers exists before accessing its length
  const registeredCount = this.registeredVolunteers ? this.registeredVolunteers.length : 0;
  return this.volunteers - registeredCount;
});

// Add method to check if opportunity is full
opportunitySchema.methods.isFull = function(this: IOpportunity): boolean {
  // Check if registeredVolunteers exists before accessing its length
  const registeredCount = this.registeredVolunteers ? this.registeredVolunteers.length : 0;
  return registeredCount >= this.volunteers;
};

// Add method to register volunteer
opportunitySchema.methods.registerVolunteer = async function(
  this: IOpportunity,
  userId: mongoose.Types.ObjectId
): Promise<boolean> {
  if (this.isFull()) {
    return false;
  }
  
  // Initialize registeredVolunteers if it doesn't exist
  if (!this.registeredVolunteers) {
    this.registeredVolunteers = [];
  }
  
  // Check if user is already registered
  const isRegistered = this.registeredVolunteers.some(id => id.toString() === userId.toString());
  if (!isRegistered) {
    this.registeredVolunteers.push(userId);
    if (this.registeredVolunteers.length >= this.volunteers) {
      this.status = 'closed';
    }
    await this.save();
    return true;
  }
  return false;
};

// Add method to unregister volunteer
opportunitySchema.methods.unregisterVolunteer = async function(
  this: IOpportunity,
  userId: mongoose.Types.ObjectId
): Promise<boolean> {
  // Initialize registeredVolunteers if it doesn't exist
  if (!this.registeredVolunteers) {
    this.registeredVolunteers = [];
    return false;
  }
  
  const index = this.registeredVolunteers.findIndex(id => id.toString() === userId.toString());
  if (index > -1) {
    this.registeredVolunteers.splice(index, 1);
    if (this.status === 'closed') {
      this.status = 'open';
    }
    await this.save();
    return true;
  }
  return false;
};

// Ensure virtuals are included when converting to JSON
opportunitySchema.set('toJSON', { virtuals: true });
opportunitySchema.set('toObject', { virtuals: true });

const Opportunity = mongoose.model<IOpportunity>('Opportunity', opportunitySchema);

export default Opportunity;