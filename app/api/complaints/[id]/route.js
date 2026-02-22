import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import Complaint from '../../../../../models/Complaint';
import User from '../../../../../models/User';
import { getSession } from '../../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const complaint = await Complaint.findById(id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name')
      .populate('remarks.userId', 'name role');

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    const user = await User.findById(userId);
    const isAdmin = user?.role === 'ADMIN';

    // Must be admin, or the owner of the complaint
    if (!isAdmin && complaint.userId._id.toString() !== userId) {
       return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Fetch complaint by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}
