'use client';

import { useState, useRef } from 'react';
import { Paperclip, X, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_FILES = 3;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

export default function FileUpload({ attachments = [], onAttachmentsChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (attachments.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    setError('');
    setUploading(true);

    const newAttachments = [...attachments];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, GIF, and PDF files are allowed');
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds 5MB limit`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          newAttachments.push({
            filePath: data.filePath,
            fileName: data.fileName,
            fileType: data.fileType,
            fileSize: data.fileSize,
          });
        } else {
          setError(data.error || 'Upload failed');
        }
      } catch (err) {
        setError('Upload failed. Please try again.');
      }
    }

    onAttachmentsChange(newAttachments);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAttachment = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(updated);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Existing Attachments */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              {att.fileType?.startsWith('image/') ? (
                <img
                  src={att.filePath}
                  alt={att.fileName}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{att.fileName}</p>
                <p className="text-xs text-slate-400">{formatSize(att.fileSize)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {attachments.length < MAX_FILES && (
        <>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.pdf"
            multiple
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
            {uploading ? 'Uploading...' : `Add Attachment (${attachments.length}/${MAX_FILES})`}
          </Button>
          <p className="text-xs text-slate-400">JPG, PNG, GIF, PDF · Max 5MB each · Up to {MAX_FILES} files</p>
        </>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
