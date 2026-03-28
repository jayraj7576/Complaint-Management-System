import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

/**
 * GET /api/admin/users/heads
 * Fetches all users with role 'ADMIN' or 'DEPARTMENT_HEAD' for assignment.
 */
export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const admin = await User.findById(userId);
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const heads = await User.find({ 
      role: { $in: ['ADMIN', 'DEPARTMENT_HEAD'] } 
    }).select('name email role').lean();

    return NextResponse.json({ success: true, heads });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
