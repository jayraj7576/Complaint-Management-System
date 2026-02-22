import connectDB from '@/lib/db';
import ComplaintHistory from '@/models/ComplaintHistory';

/**
 * Record a change in complaint history
 */
export async function recordHistory(complaintId, action, previousValue, newValue, userId) {
  try {
    await connectDB();
    await ComplaintHistory.create({ complaintId, action, previousValue, newValue, performedBy: userId });
  } catch (err) {
    console.error('recordHistory error:', err);
  }
}

/**
 * Get full history of a complaint
 */
export async function getComplaintHistory(complaintId) {
  try {
    await connectDB();
    return await ComplaintHistory.find({ complaintId })
      .sort({ timestamp: -1 })
      .populate('performedBy', 'name role')
      .lean();
  } catch (err) {
    console.error('getComplaintHistory error:', err);
    return [];
  }
}
