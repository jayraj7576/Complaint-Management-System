import path from 'path';
import fs from 'fs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validate a file before saving
 */
export function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Use JPG, PNG, GIF, or PDF.' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }
  return { valid: true };
}

/**
 * Save a file to the uploads directory
 * Returns the public URL path
 */
export async function saveFile(file, folder = 'complaints') {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.name || file.originalFilename || '.jpg');
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  // Read file buffer and write
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${folder}/${uniqueName}`;
}

/**
 * Delete a file from the uploads directory
 */
export function deleteFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error('deleteFile error:', err);
  }
}
