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

    // Validate type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Attempt to delete old avatar if it exists
    if (user.avatar) {
      console.log(`[Avatar] Requesting deletion of: ${user.avatar}`);
      deleteFile(user.avatar);
    }

    // Save new file in 'avatars' folder
    // This will return something like '/uploads/avatars/1711234567.jpg'
    const avatarUrl = await saveFile(file, 'avatars');

    user.avatar = avatarUrl;
    await user.save();

    console.log(`[Avatar] New avatar successfully saved: ${avatarUrl}`);

    return NextResponse.json({
      success: true,
      avatar: avatarUrl,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('[Avatar] Update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update avatar' },
      { status: 500 }
    );
  }
}
