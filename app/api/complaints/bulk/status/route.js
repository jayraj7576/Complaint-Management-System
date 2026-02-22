import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { recordHistory } from '@/lib/history';

// PUT /api/complaints/bulk/status
export async function PUT(req) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select('role').lean();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { complaintIds, status, remark } = await req.json();

    if (!complaintIds?.length || !status) {
      return NextResponse.json({ success: false, error: 'complaintIds and status are required' }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'ESCALATED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const complaints = await Complaint.find({ _id: { $in: complaintIds } }).select('userId status ticketId').lean();

    const updateData = { $set: { status } };
    if (status === 'RESOLVED') updateData.$set.resolvedAt = new Date();
    if (remark?.trim()) {
      updateData.$push = { remarks: { userId, content: remark.trim(), createdAt: new Date() } };
    }

    await Complaint.updateMany({ _id: { $in: complaintIds } }, updateData);

    await Promise.all(complaints.map(async (c) => {
      await recordHistory(c._id, 'STATUS_CHANGED', c.status, status, userId);
      await createNotification(
        c.userId,
        'Complaint Status Updated',
        `Your complaint ${c.ticketId} status has been updated to ${status}.`,
        status === 'RESOLVED' ? 'COMPLAINT_RESOLVED' : 'STATUS_UPDATE',
        c._id
      );
    }));

    return NextResponse.json({ success: true, updatedCount: complaintIds.length });
  } catch (err) {
    console.error('PUT bulk/status error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
