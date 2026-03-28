'use client';

import React, { useState } from 'react';
import { Camera, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AvatarUpload({ currentAvatar, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Profile picture updated');
        onUpdate(data.avatar);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="h-32 w-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
          {currentAvatar ? (
            <img 
              src={currentAvatar} 
              alt="Avatar" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-3xl">
              {/* Fallback avatar */}
              <UploadCloud className="h-10 w-10 text-slate-300" />
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        
        <label 
          htmlFor="avatar-input" 
          className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors group-hover:scale-110"
        >
          <Camera className="h-4 w-4 text-slate-600" />
          <input 
            type="file" 
            id="avatar-input" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      
      <div className="text-center">
        <h3 className="text-sm font-medium text-slate-900 border-none">Profile Picture</h3>
        <p className="text-xs text-slate-500 mt-1">Recommended size: 500x500px</p>
      </div>
    </div>
  );
}
