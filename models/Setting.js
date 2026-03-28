import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Please provide a key'],
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide a value'],
    },
    description: {
      type: String,
    },
    isAdminOnly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Performance indexes
// Explicit index removed, using schema-level unique: true

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
