import { NextResponse } from 'next/server';
import { getComplaintHistory } from '@/lib/history';
import { getSession } from '@/lib/auth';

// GET /api/complaints/[id]/history — fetch complaint history for timeline
export async function GET(req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const history = await getComplaintHistory(id);

    return NextResponse.json({ success: true, history });
  } catch (err) {
    console.error('GET /api/complaints/[id]/history error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
