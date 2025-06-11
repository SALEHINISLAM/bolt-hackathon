import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  userId: string;
  amount: number;
  platformFee: number;
  coachEarnings: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentId?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  coachId: {
    type: Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0,
    default: function(this: IPayment) {
      return this.amount * 0.1; // 10% platform fee
    }
  },
  coachEarnings: {
    type: Number,
    required: true,
    min: 0,
    default: function(this: IPayment) {
      return this.amount - this.platformFee;
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'stripe',
  },
  stripePaymentId: {
    type: String,
  },
  processedAt: {
    type: Date,
    default: function(this: IPayment) {
      return this.status === 'completed' ? new Date() : undefined;
    }
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate derived fields
PaymentSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isNew) {
    this.platformFee = this.amount * 0.1; // 10% platform fee
    this.coachEarnings = this.amount - this.platformFee;
  }
  
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  
  next();
});

// Index for better query performance
PaymentSchema.index({ coachId: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ processedAt: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);