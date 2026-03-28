import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, remarkId } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    await connectDB();
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    const remark = complaint.remarks.id(remarkId);
    if (!remark) {
      return NextResponse.json({ success: false, error: 'Remark not found' }, { status: 404 });
    }

    // Role-based security check
    const user = await User.findById(userId).select('role department');
    const isAuthor = remark.userId.toString() === userId;
    const isAdmin = user?.role === 'ADMIN';
    const isDeptHead = user?.role === 'DEPARTMENT_HEAD' && complaint.department === user?.department;

    if (!isAuthor && !isAdmin && !isDeptHead) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    remark.content = content;
    await complaint.save();

    return NextResponse.json({
      success: true,
      message: 'Remark updated successfully',
    });
  } catch (error) {
    console.error('Update remark error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update remark' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, remarkId } = await params;

    await connectDB();
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    const remark = complaint.remarks.id(remarkId);
    if (!remark) {
      return NextResponse.json({ success: false, error: 'Remark not found' }, { status: 404 });
    }

    // Role-based security check
    const user = await User.findById(userId).select('role department');
    const isAuthor = remark.userId.toString() === userId;
    const isAdmin = user?.role === 'ADMIN';
    const isDeptHead = user?.role === 'DEPARTMENT_HEAD' && complaint.department === user?.department;

    if (!isAuthor && !isAdmin && !isDeptHead) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    complaint.remarks.pull(remarkId);
    await complaint.save();

    return NextResponse.json({
      success: true,
      message: 'Remark deleted successfully',
    });
  } catch (error) {
    console.error('Delete remark error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete remark' },
      { status: 500 }
    );
  }
}
