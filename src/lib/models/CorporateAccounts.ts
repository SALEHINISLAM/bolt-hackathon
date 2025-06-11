import mongoose, { Document, Schema } from 'mongoose';

export interface ICorporateAccount extends Document {
  companyName: string;
  adminUserId: string; // Reference to User with admin role
  contactEmail: string;
  contactName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  employees: string[]; // Array of employee email addresses
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  isActive: boolean;
  billingInfo?: {
    billingEmail: string;
    paymentMethod?: string;
    lastPayment?: Date;
    nextBilling?: Date;
  };
  settings: {
    allowSelfBooking: boolean;
    requireApproval: boolean;
    maxSessionsPerEmployee: number;
    allowedCoachCategories: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CorporateAccountSchema = new Schema<ICorporateAccount>({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  adminUserId: {
    type: String,
    required: true,
    unique: true,
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'United States' },
  },
  credits: {
    total: { type: Number, default: 0, min: 0 },
    used: { type: Number, default: 0, min: 0 },
    remaining: { 
      type: Number, 
      default: 0, 
      min: 0,
      get: function(this: ICorporateAccount) {
        return Math.max(0, this.credits.total - this.credits.used);
      }
    },
  },
  employees: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  billingInfo: {
    billingEmail: String,
    paymentMethod: String,
    lastPayment: Date,
    nextBilling: Date,
  },
  settings: {
    allowSelfBooking: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxSessionsPerEmployee: { type: Number, default: 10 },
    allowedCoachCategories: [{ type: String }],
  },
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true },
});

// Pre-save middleware to calculate remaining credits
CorporateAccountSchema.pre('save', function(next) {
  this.credits.remaining = Math.max(0, this.credits.total - this.credits.used);
  next();
});

// Index for better query performance
CorporateAccountSchema.index({ adminUserId: 1 });
CorporateAccountSchema.index({ contactEmail: 1 });
CorporateAccountSchema.index({ employees: 1 });
CorporateAccountSchema.index({ isActive: 1 });

export default mongoose.models.CorporateAccount || 
  mongoose.model<ICorporateAccount>('CorporateAccount', CorporateAccountSchema);