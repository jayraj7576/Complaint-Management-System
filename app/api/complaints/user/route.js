import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import Complaint from '../../../../../models/Complaint';
import { getSession } from '../../../../../lib/auth';

// GET /api/complaints/user — Get complaints for the logged-in user
// Supports: ?status=PENDING&search=library&page=1&limit=10
export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    // ── Filters ────────────────────────────────────────────────
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // ── Pagination ─────────────────────────────────────────────
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip  = (page - 1) * limit;

    // ── Build filter ───────────────────────────────────────────
    const filter = { userId };

    if (status && status !== 'ALL') filter.status = status;

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId:    { $regex: search, $options: 'i' } },
      ];
    }

    // ── Query ──────────────────────────────────────────────────
    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Complaint.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      complaints,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch user complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
