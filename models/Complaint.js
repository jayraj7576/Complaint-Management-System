import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      enum: [
        'INFRASTRUCTURE',
        'ACADEMIC',
        'ADMINISTRATIVE',
        'HOSTEL',
        'LIBRARY',
        'CANTEEN',
        'OTHER',
      ],
      required: [true, 'Please provide a category'],
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'ESCALATED'],
      default: 'PENDING',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate ticketId before saving
ComplaintSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Complaint').countDocuments();
    this.ticketId = `CMP-${dateString}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
