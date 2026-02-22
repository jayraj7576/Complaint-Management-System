import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { getSession } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { recordHistory } from '@/lib/history';
import User from '@/models/User';

// POST /api/complaints/[id]/escalate
export async function POST(req, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { reason, escalateTo } = await req.json();

    if (!reason?.trim()) {
      return NextResponse.json({ success: false, error: 'Escalation reason is required' }, { status: 400 });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    // Only the owner or an admin can escalate
    const user = await User.findById(userId).select('role').lean();
    const isOwner = complaint.userId.toString() === userId;
    const isAdmin = user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
    }

    if (complaint.status === 'ESCALATED') {
      return NextResponse.json({ success: false, error: 'Complaint is already escalated' }, { status: 400 });
    }

    const previousStatus = complaint.status;
    complaint.status = 'ESCALATED';
    await complaint.save();

    // Record history
    await recordHistory(id, 'STATUS_CHANGED', previousStatus, 'ESCALATED', userId);

    // Notify the complaint owner
    await createNotification(
      complaint.userId,
      'Complaint Escalated',
      `Your complaint ${complaint.ticketId} has been escalated. Reason: ${reason}`,
      'STATUS_UPDATE',
      id
    );

    return NextResponse.json({ success: true, message: 'Complaint escalated successfully' });
  } catch (err) {
    console.error('POST escalate error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
