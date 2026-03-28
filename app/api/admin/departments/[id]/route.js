import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// Helper for admin check
async function checkAdmin() {
  const userId = await getSession();
  if (!userId) return { error: 'Unauthorized', status: 401 };
  
  await connectDB();
  const user = await User.findById(userId);
  if (!user || user.role !== 'ADMIN') return { error: 'Forbidden', status: 403 };
  
  return { user };
}

// PATCH /api/admin/departments/[id] - Update a department
export async function PATCH(request, { params }) {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    
    const department = await Department.findByIdAndUpdate(id, data, { new: true }).populate('headId', 'name email');
    
    if (!department) {
      return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, department });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update department' }, { status: 500 });
  }
}

// DELETE /api/admin/departments/[id] - Delete a department
export async function DELETE(request, { params }) {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const { id } = await params;
    const department = await Department.findByIdAndDelete(id);
    
    if (!department) {
      return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete department' }, { status: 500 });
  }
}
