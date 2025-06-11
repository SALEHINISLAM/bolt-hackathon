import mongoose, { Document, Schema } from 'mongoose';

export interface ICoach extends Document {
  name: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  bio: string;
  image: string;
  experience: number;
  certifications: string[];
  languages: string[];
  availableSlots: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<ICoach>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  expertise: [{
    type: String,
    required: true,
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  certifications: [{
    type: String,
  }],
  languages: [{
    type: String,
    default: ['English'],
  }],
  availableSlots: [{
    type: Date,
  }],
}, {
  timestamps: true,
});

// Index for better query performance
CoachSchema.index({ rating: -1 });
CoachSchema.index({ hourlyRate: 1 });
CoachSchema.index({ expertise: 1 });

export default mongoose.models.Coach || mongoose.model<ICoach>('Coach', CoachSchema);