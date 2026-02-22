import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';
import Complaint from '../../../../models/Complaint';
import { getSession } from '../../../../lib/auth';

// GET /api/users - Get all users (Admin only)
export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const currentUser = await User.findById(userId);

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Get all users excluding password
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

    // Aggregate complaints count per user
    const userIds = users.map((u) => u._id);
    const complaintsCounts = await Complaint.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const usersWithCounts = users.map((u) => {
      const match = complaintsCounts.find((c) => c._id.toString() === u._id.toString());
      return {
        ...u,
        totalComplaints: match ? match.count : 0,
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithCounts,
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
