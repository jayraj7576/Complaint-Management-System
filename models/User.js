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
    phone: {
      type: String,
    },
    department: {
      type: String,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Performance indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
