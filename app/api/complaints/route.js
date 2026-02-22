import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Complaint from '../../../../models/Complaint';
import { getSession } from '../../../../lib/auth';

// POST /api/complaints - Create a new complaint
export async function POST(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, category, priority, department } = data;

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
    });

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

// GET /api/complaints - Get all complaints (Admin only)
export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if user is admin
    const User = (await import('../../../../models/User')).default;
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'PENDING' });
    const inProgress = await Complaint.countDocuments({ status: 'IN_PROGRESS' });
    const resolved = await Complaint.countDocuments({ status: 'RESOLVED' });

    return NextResponse.json({
      success: true,
      complaints,
      total,
      pending,
      inProgress,
      resolved,
    });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
