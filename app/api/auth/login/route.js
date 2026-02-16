import { NextResponse } from 'next/server';
import { findUserByEmail, validatePassword, getUserWithoutPassword } from '../../../../lib/mock-db.js';
import { createSession } from '../../../../lib/auth.js';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user in mock database
    const user = findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Validate password (simple comparison for mock)
    const isMatch = validatePassword(user, password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user._id);

    // Return user without password
    const userWithoutPassword = getUserWithoutPassword(user);

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
