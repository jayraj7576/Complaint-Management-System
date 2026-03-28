import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { notifyAssignment } from '@/lib/notifications';
import { recordHistory } from '@/lib/history';

export async function PUT(request, { params }) {
  try {
    const adminId = await getSession();
    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { assignedTo } = await request.json();

    await connectDB();
    const adminUser = await User.findById(adminId).select('role department');
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'DEPARTMENT_HEAD')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    // Role-based security check for assignment
    if (adminUser.role === 'DEPARTMENT_HEAD' && complaint.department !== adminUser.department) {
      return NextResponse.json({ success: false, error: 'Forbidden: You can only assign complaints in your department' }, { status: 403 });
    }

    // Handle 'none' as unassigning
    if (assignedTo === 'none') {
        complaint.assignedTo = undefined;
    } else {
        // Verify assignee exists and is staff/admin
        const assignee = await User.findById(assignedTo);
        if (!assignee) {
            return NextResponse.json({ success: false, error: 'Assignee not found' }, { status: 404 });
        }
        complaint.assignedTo = assignedTo;
        
        // Auto-update status to IN_PROGRESS if it was PENDING
        if (complaint.status === 'PENDING') {
            complaint.status = 'IN_PROGRESS';
            complaint.remarks.push({
                userId: adminId,
                content: `Complaint assigned to ${assignee.name}. Status moved to In Progress.`,
                createdAt: new Date()
            });
        }
    }

    await complaint.save();
    
    // 🔔 Notify the assigned user (if not 'none')
    if (assignedTo !== 'none') {
        const assignee = await User.findById(assignedTo).select('name');
        if (assignee) {
            await notifyAssignment(id, assignee.name);
        }
    }

    // 📜 Record in history
    await recordHistory(id, 'ASSIGNED', null, assignedTo === 'none' ? 'Unassigned' : 'Staff Member', adminId);
    
    // Fetch populated complaint to return updated state
    const updatedComplaint = await Complaint.findById(id).populate('assignedTo', 'name email department');

    return NextResponse.json({
      success: true,
      message: 'Assignment updated',
      assignedTo: updatedComplaint.assignedTo
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign complaint' },
      { status: 500 }
    );
  }
}
