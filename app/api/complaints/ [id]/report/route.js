import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { generateSingleComplaintPDF } from '@/lib/pdf';

export async function GET(req, { params }) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    // Fetch complaint with all details
    const complaint = await Complaint.findById(id)
      .populate('userId', 'name email department')
      .populate('assignedTo', 'name email')
      .populate('remarks.userId', 'name role')
      .lean();

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    // Checking permissions: Owner, Assigned Staff, or Admin
    const user = await getSession(req); // In case we need more user info, but userId is enough for simple check
    // For now, let's just check if it's the owner or an admin
    // Note: session helper might need to be called differently if we want role, 
    // but the task assumes we are already in a secure context or just checking ID for now.
    // Let's refine the security check.
    
    // We already have userId. Let's get the user's role.
    const User = (await import('@/models/User')).default;
    const dbUser = await User.findById(userId).select('role').lean();

    if (complaint.userId._id.toString() !== userId && dbUser.role === 'USER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const buffer = await generateSingleComplaintPDF(complaint);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Complaint_${complaint.ticketId}.pdf"`
      }
    });
  } catch (err) {
    console.error('Individual report export error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
