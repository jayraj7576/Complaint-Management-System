import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { getSession } from '@/lib/auth';
import { recordHistory } from '@/lib/history';

// POST /api/complaints - Create a new complaint
export async function POST(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, category, priority, department, attachments } = data;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, description and category are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'MEDIUM',
      department,
      userId,
      status: 'PENDING',
      attachments: attachments || [],
    });

    // Record creation in history so timeline shows "Complaint submitted"
    await recordHistory(complaint._id, 'CREATED', null, null, userId);

    return NextResponse.json(
      {
        success: true,
        message: 'Complaint submitted successfully',
        complaint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}

// GET /api/complaints - Get all complaints (Admin only) with search, date filter, pagination
export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const User = (await import('@/models/User')).default;
    const user = await User.findById(userId);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'DEPARTMENT_HEAD')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // ── Build filter object ────────────────────────────────────
    const filter = {};
    if (user.role === 'DEPARTMENT_HEAD') {
        filter.department = user.department;
    }

    // ── Filters ────────────────────────────────────────────────
    const status   = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search   = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo   = searchParams.get('dateTo');

    // ── Pagination ─────────────────────────────────────────────
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(500, parseInt(searchParams.get('limit') || '50'));
    const skip  = (page - 1) * limit;

    // ── Query ──────────────────────────────────────────────────
    const [complaints, totalFiltered] = await Promise.all([
      Complaint.find(filter)
        .select('ticketId title category priority status createdAt userId department')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      Complaint.countDocuments(filter),
    ]);

    // Global stats (always over entire collection)
    const [total, pending, inProgress, resolved, escalated] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'PENDING' }),
      Complaint.countDocuments({ status: 'IN_PROGRESS' }),
      Complaint.countDocuments({ status: 'RESOLVED' }),
      Complaint.countDocuments({ status: 'ESCALATED' }),
    ]);

    return NextResponse.json({
      success: true,
      complaints,
      total,
      pending,
      inProgress,
      resolved,
      escalated,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        pages: Math.ceil(totalFiltered / limit),
      },
    });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

