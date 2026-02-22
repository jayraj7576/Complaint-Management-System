import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import connectDB from '../../../lib/db';
import User from '../../../models/User';

export async function GET(request) {
  try {
    const userId = await getSession();
    
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    await connectDB();
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
