import { cookies } from 'next/headers';
import { hashPassword, comparePassword } from './hash.js';

export async function createSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  return session?.value || null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
