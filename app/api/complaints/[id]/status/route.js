import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/db';
import Complaint from '../../../../../../models/Complaint';
import User from '../../../../../../models/User';
import { getSession } from '../../../../../../lib/auth';
import { notifyStatusChange } from '../../../../../../lib/notifications';
import { recordHistory } from '../../../../../../lib/history';

export async function PUT(request, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);

    // Allow ADMIN or DEPARTMENT_HEAD
    if (!user || !['ADMIN', 'DEPARTMENT_HEAD'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const { status, remark } = data;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const { id } = await params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    const previousStatus = complaint.status;
    complaint.status = status;

    // Add remark if provided
    if (remark) {
      complaint.remarks.push({ userId, content: remark });
    }

    // Set resolved timestamp
    if (status === 'RESOLVED') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // 🔔 Fire notification to complaint owner
    await notifyStatusChange(id, previousStatus, status);

    // 📜 Record in history timeline
    await recordHistory(id, 'STATUS_CHANGED', previousStatus, status, userId);

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      complaint,
    });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
