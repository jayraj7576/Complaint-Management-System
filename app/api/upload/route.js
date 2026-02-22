import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { validateFile, saveFile } from '@/lib/upload';

// POST /api/upload — handle file upload for complaints
export async function POST(req) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // Save file to public/uploads/complaints/
    const filePath = await saveFile(file, 'complaints');

    return NextResponse.json({
      success: true,
      filePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }, { status: 201 });

  } catch (err) {
    console.error('POST /api/upload error:', err);
    return NextResponse.json({ success: false, error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
