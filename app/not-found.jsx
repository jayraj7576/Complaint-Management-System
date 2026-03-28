'use client';

import Link from 'next/link';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative inline-block">
          <div className="h-24 w-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-600 animate-pulse">
            <AlertCircle size={48} />
          </div>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
            404
          </span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 border-none">Page Not Found</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            The resource you are looking for has been moved, removed, or simply non-existent.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft size={16} /> Go Back
            </Link>
          </Button>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Link href="/" className="flex items-center gap-2">
              <Home size={16} /> Return Home
            </Link>
          </Button>
        </div>
      </div>
      
      <p className="mt-20 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">
        © JSPM's Complaint Management System
      </p>
    </div>
  );
}
