import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// Middleware-like check for admin
async function checkAdmin() {
  const userId = await getSession();
  if (!userId) return { error: 'Unauthorized', status: 401 };
  
  await connectDB();
  const user = await User.findById(userId);
  if (!user || user.role !== 'ADMIN') return { error: 'Forbidden', status: 403 };
  
  return { user };
}

// GET /api/admin/departments - Get all departments
export async function GET() {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const departments = await Department.find({}).populate('headId', 'name email').sort({ name: 1 });
    return NextResponse.json({ success: true, departments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch departments' }, { status: 500 });
  }
}

// POST /api/admin/departments - Create a new department
export async function POST(request) {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const data = await request.json();
    const department = await Department.create(data);
    return NextResponse.json({ success: true, department });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Department name or code already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create department' }, { status: 500 });
  }
}
