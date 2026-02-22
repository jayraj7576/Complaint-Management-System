import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import Complaint from '../../../../../models/Complaint';
import { getSession } from '../../../../../lib/auth';

export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const complaints = await Complaint.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error('Fetch user complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
