import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';

export async function GET(request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
