import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// DELETE /api/complaints/bulk — soft delete
export async function DELETE(req) {
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

    const { complaintIds } = await req.json();

    if (!complaintIds?.length) {
      return NextResponse.json({ success: false, error: 'complaintIds array is required' }, { status: 400 });
    }

    // Soft delete: set isActive to false
    await Complaint.updateMany(
      { _id: { $in: complaintIds } },
      { $set: { isActive: false } }
    );

    return NextResponse.json({ success: true, deletedCount: complaintIds.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
