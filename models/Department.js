import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a department name'],
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a department code'],
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    headId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Performance indexes
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ isActive: 1 });

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
