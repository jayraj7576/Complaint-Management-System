import { NextResponse } from 'next/server';
import connectDB from '@/lib/db.js';
import User from '@/models/User.js';
import { comparePassword } from '@/lib/hash.js';
import { createSession } from '@/lib/auth.js';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user in real database
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Validate hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check account status (User Approval Workflow)
    if (user.role !== 'ADMIN' && user.status && user.status !== 'APPROVED') {
       return NextResponse.json(
         { 
           error: user.status === 'PENDING' 
             ? 'Your account is pending approval by your Department Head.' 
             : `Your account access has been ${user.status.toLowerCase()}.` 
         },
         { status: 403 }
       );
    }

    // Create session with real ObjectId
    await createSession(user._id.toString());

    // Prepare user object for frontend (sanitize)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
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
