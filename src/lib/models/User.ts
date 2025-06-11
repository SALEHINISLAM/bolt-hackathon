import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  image?: string;
  role: 'client' | 'coach' | 'admin';
  provider: string;
  providerId?: string;
  emailVerified?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['client', 'coach', 'admin'],
    default: 'client',
  },
  provider: {
    type: String,
    required: true,
    enum: ['credentials', 'google', 'github'],
  },
  providerId: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1, providerId: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);