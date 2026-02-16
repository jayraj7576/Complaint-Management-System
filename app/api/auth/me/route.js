import { getSession } from '../../../../lib/auth.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    // For static auth, we'll return the user from session storage
    // In a real app, you'd fetch from database
    // For now, return a basic response indicating session exists
    return NextResponse.json({ 
      user: { 
        _id: userId,
        // Session exists but we don't have full user data in static mode
        // The frontend AuthContext will handle this
      } 
    });
  } catch (error) {
    console.error('Fetch current user error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
