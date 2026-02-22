import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/db';
import Complaint from '../../../../../../models/Complaint';
import { getSession } from '../../../../../../lib/auth';

export async function POST(request, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { content } = data;

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;
    
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    complaint.remarks.push({
      userId,
      content,
    });

    await complaint.save();

    return NextResponse.json({
      success: true,
      message: 'Remark added successfully',
    });
  } catch (error) {
    console.error('Add remark error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add remark' },
      { status: 500 }
    );
  }
}
