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
SettingSchema.index({ key: 1 });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
