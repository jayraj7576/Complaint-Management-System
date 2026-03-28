import path from 'path';
import fs from 'fs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validate a file before saving
 */
export function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Use JPG, PNG, WEBP, GIF, or PDF.' };
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
  try {
    // Ensure the folder name is safe and normalized
    const sanitizedFolder = folder.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads', sanitizedFolder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log(`[Upload] Creating directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name || file.originalFilename || '.jpg');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    console.log(`[Upload] Saving file to: ${filePath}`);

    // Read file buffer and write
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Return the relative URL for public access
    // We use forward slashes for the URL regardless of the OS
    return `/uploads/${sanitizedFolder}/${uniqueName}`;
  } catch (error) {
    console.error('[Upload] saveFile error:', error);
    throw new Error('Failed to save file on server');
  }
}

/**
 * Delete a file from the uploads directory
 */
export function deleteFile(relativeUrl) {
  if (!relativeUrl || !relativeUrl.startsWith('/uploads/')) return;

  try {
    // Remove leading slash for path.join
    const cleanUrl = relativeUrl.startsWith('/') ? relativeUrl.slice(1) : relativeUrl;
    const fullPath = path.join(process.cwd(), 'public', cleanUrl);
    
    if (fs.existsSync(fullPath)) {
        console.log(`[Upload] Deleting obsolete file: ${fullPath}`);
        fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error('[Upload] deleteFile error:', err);
  }
}
