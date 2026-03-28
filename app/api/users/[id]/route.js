import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const adminId = await getSession();
    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const adminUser = await User.findById(adminId).select('name role department');

    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'DEPARTMENT_HEAD')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const { role, department, isActive, status } = data;

    const userToUpdate = await User.findById(id).select('-password');

    if (!userToUpdate) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Security: Department Head can only update users in their department
    if (adminUser.role === 'DEPARTMENT_HEAD' && userToUpdate.department !== adminUser.department) {
       return NextResponse.json({ success: false, error: 'Forbidden: You can only manage users in your department' }, { status: 403 });
    }

    // Role updates are ADMIN only
    if (role && adminUser.role === 'ADMIN') userToUpdate.role = role;
    if (department !== undefined) userToUpdate.department = department;
    if (isActive !== undefined) userToUpdate.isActive = isActive;
    if (status !== undefined) userToUpdate.status = status;

    await userToUpdate.save();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: userToUpdate,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
