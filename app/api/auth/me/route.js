import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { getSession } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    await dbConnect();

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Fetch current user error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
