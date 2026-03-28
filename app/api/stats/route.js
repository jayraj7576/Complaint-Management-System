import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let stats = {};

    if (user.role === 'ADMIN') {
      const counts = await Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      const total = await Complaint.countDocuments();
      
      stats = {
        total,
        pending: counts.find(c => c._id === 'PENDING')?.count || 0,
        inProgress: counts.find(c => c._id === 'IN_PROGRESS')?.count || 0,
        resolved: counts.find(c => c._id === 'RESOLVED')?.count || 0,
      };
    } else if (user.role === 'DEPARTMENT_HEAD') {
      const counts = await Complaint.aggregate([
        { $match: { department: user.department } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      const total = await Complaint.countDocuments({ department: user.department });
      
      stats = {
        total,
        pending: counts.find(c => c._id === 'PENDING')?.count || 0,
        inProgress: counts.find(c => c._id === 'IN_PROGRESS')?.count || 0,
        resolved: counts.find(c => c._id === 'RESOLVED')?.count || 0,
      };
    } else {
      const counts = await Complaint.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      const total = await Complaint.countDocuments({ userId: user._id });
      
      stats = {
        total,
        pending: counts.find(c => c._id === 'PENDING')?.count || 0,
        inProgress: counts.find(c => c._id === 'IN_PROGRESS')?.count || 0,
        resolved: counts.find(c => c._id === 'RESOLVED')?.count || 0,
      };
    }

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
