import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { recordHistory } from '@/lib/history';

// PUT /api/complaints/bulk/assign
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

    const { complaintIds, assignTo } = await req.json();

    if (!complaintIds?.length || !assignTo) {
      return NextResponse.json({ success: false, error: 'complaintIds and assignTo are required' }, { status: 400 });
    }

    const complaints = await Complaint.find({ _id: { $in: complaintIds } }).select('userId ticketId').lean();

    await Complaint.updateMany({ _id: { $in: complaintIds } }, { $set: { assignedTo: assignTo } });

    await Promise.all(complaints.map(async (c) => {
      await recordHistory(c._id, 'ASSIGNED', null, assignTo, userId);
      await createNotification(
        c.userId,
        'Complaint Assigned',
        `Your complaint ${c.ticketId} has been assigned to a team member.`,
        'COMPLAINT_ASSIGNED',
        c._id
      );
    }));

    return NextResponse.json({ success: true, assignedCount: complaintIds.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
