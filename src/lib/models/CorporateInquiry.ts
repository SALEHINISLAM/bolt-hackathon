import mongoose, { Document, Schema } from 'mongoose';

export interface ICorporateInquiry extends Document {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  companySize?: string;
  industry?: string;
  region?: string;
  interestedServices: string[];
  budget?: string;
  timeline?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'closed_won' | 'closed_lost';
  source: string;
  followUpDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateInquirySchema = new Schema<ICorporateInquiry>({
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  region: {
    type: String,
    enum: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa', 'Other'],
  },
  interestedServices: [{
    type: String,
    enum: [
      'Leadership Development',
      'Employee Retention',
      'DEI Coaching',
      'Career Transition Support',
      'Executive Coaching',
      'Team Building',
      'Performance Coaching',
      'Custom Programs'
    ],
  }],
  budget: {
    type: String,
    enum: ['Under $5,000', '$5,000 - $15,000', '$15,000 - $50,000', '$50,000 - $100,000', 'Over $100,000'],
  },
  timeline: {
    type: String,
    enum: ['Immediate', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Future planning'],
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost'],
    default: 'new',
  },
  source: {
    type: String,
    default: 'corporate_website',
  },
  followUpDate: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// Index for better query performance
CorporateInquirySchema.index({ email: 1 });
CorporateInquirySchema.index({ status: 1, createdAt: -1 });
CorporateInquirySchema.index({ companyName: 1 });
CorporateInquirySchema.index({ region: 1 });

export default mongoose.models.CorporateInquiry || 
  mongoose.model<ICorporateInquiry>('CorporateInquiry', CorporateInquirySchema);