import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { getSession } from '@/lib/auth';

// PUT /api/notifications/read-all
export async function PUT() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
