import { NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import User from '@/models/User.js';
import { hashPassword } from '@/lib/hash.js';

export async function POST(req) {
  try {
    const { name, email, password, phone, role, department } = await req.json();

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

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user in real database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: role || 'USER', // Allow staff registration if role provided
      department: department || 'General',
      status: 'PENDING', // Forced pending until approved
    });

    // Prepare response (sanitize password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        user: userResponse
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
