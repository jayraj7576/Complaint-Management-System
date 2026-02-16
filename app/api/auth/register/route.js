import { NextResponse } from 'next/server';
import { createUser, getUserWithoutPassword } from '../../../../lib/mock-db.js';

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide name, email, and password' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    try {
      // Create user in mock database
      const user = createUser({
        name,
        email,
        password,
        phone: phone || '',
        department: 'General',
      });

      // Return user without password
      const userWithoutPassword = getUserWithoutPassword(user);

      return NextResponse.json(
        { 
          message: 'User registered successfully', 
          user: userWithoutPassword 
        },
        { status: 201 }
      );
    } catch (error) {
      if (error.message === 'User already exists') {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
