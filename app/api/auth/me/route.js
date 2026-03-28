import { getSession } from '@/lib/auth.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import User from '@/models/User.js';

export async function GET() {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[Auth API] Fetch current user error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
