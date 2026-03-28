import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Setting';
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

// GET /api/admin/settings - Get all system settings
export async function GET() {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const settings = await Setting.find({});
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('SERVER_ERROR: GET /api/admin/settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings: ' + err.message }, { status: 500 });
  }
}

// POST /api/admin/settings - Bulk update settings
export async function POST(request) {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status });
  }

  try {
    const data = await request.json(); // { key: value, key2: value2 }
    
    // Process each setting update
    const promises = Object.entries(data).map(([key, value]) => 
      Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    );
    
    await Promise.all(promises);
    
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
