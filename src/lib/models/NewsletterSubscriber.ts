import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
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
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.NewsletterSubscriber || 
  mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);