import mongoose from 'mongoose';

const complaintHistorySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATED', 'STATUS_CHANGED', 'REMARK_ADDED', 'ASSIGNED', 'PRIORITY_CHANGED', 'ATTACHMENT_ADDED'],
    required: true,
  },
  previousValue: {
    type: String,
    default: null,
  },
  newValue: {
    type: String,
    default: null,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

complaintHistorySchema.index({ complaintId: 1, timestamp: -1 });

export default mongoose.models.ComplaintHistory || mongoose.model('ComplaintHistory', complaintHistorySchema);
