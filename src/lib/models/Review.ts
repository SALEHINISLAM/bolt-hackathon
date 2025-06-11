import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  coachId: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  sessionDate: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  coachId: {
    type: Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userAvatar: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
ReviewSchema.index({ coachId: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);