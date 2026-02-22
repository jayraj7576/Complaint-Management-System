import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import Complaint from '@/models/Complaint';

/**
 * Create a new notification for a user
 */
export async function createNotification(userId, title, message, type, complaintId = null) {
  try {
    await connectDB();
    await Notification.create({ userId, title, message, type, complaintId });
  } catch (err) {
    console.error('createNotification error:', err);
  }
}

/**
 * Notify a user when a complaint status changes
 */
export async function notifyStatusChange(complaintId, oldStatus, newStatus) {
  try {
    await connectDB();
    const complaint = await Complaint.findById(complaintId).select('userId ticketId title').lean();
    if (!complaint) return;

    await createNotification(
      complaint.userId,
      'Complaint Status Updated',
      `Your complaint ${complaint.ticketId} status changed from ${oldStatus} to ${newStatus}.`,
      newStatus === 'RESOLVED' ? 'COMPLAINT_RESOLVED' : 'STATUS_UPDATE',
      complaintId
    );
  } catch (err) {
    console.error('notifyStatusChange error:', err);
  }
}

/**
 * Notify a user when a remark is added to their complaint
 */
export async function notifyNewRemark(complaintId, remarkByName) {
  try {
    await connectDB();
    const complaint = await Complaint.findById(complaintId).select('userId ticketId').lean();
    if (!complaint) return;

    await createNotification(
      complaint.userId,
      'New Comment on Your Complaint',
      `${remarkByName} added a comment on complaint ${complaint.ticketId}.`,
      'NEW_REMARK',
      complaintId
    );
  } catch (err) {
    console.error('notifyNewRemark error:', err);
  }
}

/**
 * Notify a user when their complaint is assigned
 */
export async function notifyAssignment(complaintId, assignedToName) {
  try {
    await connectDB();
    const complaint = await Complaint.findById(complaintId).select('userId ticketId').lean();
    if (!complaint) return;

    await createNotification(
      complaint.userId,
      'Complaint Assigned',
      `Your complaint ${complaint.ticketId} has been assigned to ${assignedToName}.`,
      'COMPLAINT_ASSIGNED',
      complaintId
    );
  } catch (err) {
    console.error('notifyAssignment error:', err);
  }
}

/**
 * Notify a user when their complaint is resolved
 */
export async function notifyResolution(complaintId) {
  try {
    await connectDB();
    const complaint = await Complaint.findById(complaintId).select('userId ticketId').lean();
    if (!complaint) return;

    await createNotification(
      complaint.userId,
      'Complaint Resolved! ✅',
      `Great news! Your complaint ${complaint.ticketId} has been resolved.`,
      'COMPLAINT_RESOLVED',
      complaintId
    );
  } catch (err) {
    console.error('notifyResolution error:', err);
  }
}
