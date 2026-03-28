import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { saveFile, validateFile, deleteFile } from '@/lib/upload';

// POST /api/users/avatar - Update profile picture
export async function POST(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Delete old avatar if it exists
    if (user.avatar) {
      deleteFile(user.avatar);
    }

    // Save new file in 'avatars' folder
    const avatarUrl = await saveFile(file, 'avatars');

    user.avatar = avatarUrl;
    await user.save();

    return NextResponse.json({
      success: true,
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update avatar' },
      { status: 500 }
    );
  }
}
