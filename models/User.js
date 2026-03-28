import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'DEPARTMENT_HEAD'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    department: {
      type: String,
    },
    avatar: {
      type: String,
      default: null,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      browser: { type: Boolean, default: true },
      frequency: { type: String, enum: ['IMMEDIATE', 'DAILY', 'WEEKLY'], default: 'IMMEDIATE' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Performance indexes
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);

