import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Complaint from '@/models/Complaint';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/hash';

// GET /api/users - Get all users (Admin only)
export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const currentUser = await User.findById(userId);

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'DEPARTMENT_HEAD')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Prepare query: Admin sees all, Head sees their department
    const query = currentUser.role === 'ADMIN' ? {} : { department: currentUser.department };
    
    // Get users excluding password
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();

    // Aggregate complaints count per user
    const userIds = users.map((u) => u._id);
    const complaintsCounts = await Complaint.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const usersWithCounts = users.map((u) => {
      const match = complaintsCounts.find((c) => c._id.toString() === u._id.toString());
      return {
        ...u,
        totalComplaints: match ? match.count : 0,
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithCounts,
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(request) {
  try {
    const adminId = await getSession();
    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, password, role, department } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'USER',
      department: department || 'General',
      status: 'APPROVED', // Admins create already-approved staff
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
