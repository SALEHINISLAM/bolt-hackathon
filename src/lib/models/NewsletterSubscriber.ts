import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  verificationToken?: string;
  subscribedAt?: Date;
  verifiedAt?: Date;
  isActive: boolean;
  source?: string;
  preferences?: {
    careerTips: boolean;
    coachSpotlights: boolean;
    industryNews: boolean;
    weeklyDigest: boolean;
  };
  unsubscribedAt?: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  subscribedAt: {
    type: Date,
  },
  verifiedAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  source: {
    type: String,
    default: 'website',
    enum: ['website', 'social', 'referral', 'event', 'other'],
  },
  preferences: {
    careerTips: {
      type: Boolean,
      default: true,
    },
    coachSpotlights: {
      type: Boolean,
      default: true,
    },
    industryNews: {
      type: Boolean,
      default: true,
    },
    weeklyDigest: {
      type: Boolean,
      default: true,
    },
  },
  unsubscribedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for better query performance
NewsletterSubscriberSchema.index({ email: 1 });
NewsletterSubscriberSchema.index({ isVerified: 1, isActive: 1 });
NewsletterSubscriberSchema.index({ verificationToken: 1 });

export default mongoose.models.NewsletterSubscriber || 
  mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);