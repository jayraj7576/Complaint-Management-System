import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select('role department');
    if (!user || (user.role !== 'ADMIN' && user.role !== 'DEPARTMENT_HEAD')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Admins see all staff, Dept Heads see staff in their department
    const query = { role: { $in: ['ADMIN', 'DEPARTMENT_HEAD'] }, status: 'APPROVED' };
    if (user.role === 'DEPARTMENT_HEAD') {
      query.department = user.department;
    }

    const staff = await User.find(query).select('name email role department');

    return NextResponse.json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error('Fetch staff error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff list' },
      { status: 500 }
    );
  }
}
