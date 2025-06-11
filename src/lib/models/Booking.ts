import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  coachId: mongoose.Types.ObjectId;
  dateTime: Date;
  duration: number; // in minutes (30 or 60)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  paymentId?: string;
  videoLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: {
    type: String,
    required: true,
  },
  coachId: {
    type: Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    enum: [30, 60],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentId: {
    type: String,
  },
  videoLink: {
    type: String,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Index for better query performance
BookingSchema.index({ userId: 1, dateTime: -1 });
BookingSchema.index({ coachId: 1, dateTime: 1 });
BookingSchema.index({ status: 1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);