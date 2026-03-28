'use client';

import { useState } from 'react';
import { X, Download, FileText, ZoomIn } from 'lucide-react';

function ImageLightbox({ src, alt, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-full transition-colors shadow-sm"
        >
          <X className="h-6 w-6" />
        </button>
        <img src={src} alt={alt} className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white" />
        <a
          href={src}
          download={alt}
          className="absolute bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-sm font-black flex items-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Download className="h-4 w-4" />
          Download Asset
        </a>
      </div>
    </div>
  );
}

export default function AttachmentGallery({ attachments = [] }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxName, setLightboxName] = useState('');

  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.fileType?.startsWith('image/'));
  const pdfs = attachments.filter((a) => a.fileType === 'application/pdf');

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Attachments ({attachments.length})
        </h3>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setLightboxSrc(img.filePath); setLightboxName(img.fileName); }}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group shrink-0"
              >
                <img
                  src={img.filePath}
                  alt={img.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* PDF List */}
        {pdfs.length > 0 && (
          <div className="space-y-2">
            {pdfs.map((pdf, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{pdf.fileName}</p>
                  <p className="text-xs text-slate-400">PDF Document</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={pdf.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                  >
                    View
                  </a>
                  <a
                    href={pdf.filePath}
                    download={pdf.fileName}
                    className="text-xs text-slate-600 hover:text-slate-800 font-medium px-2 py-1 rounded border border-slate-200 hover:bg-slate-50"
                  >
                    <Download className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt={lightboxName}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </>
  );
}
