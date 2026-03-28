'use client';

import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to an analytics service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-block p-4 rounded-3xl bg-amber-50 text-amber-600 border border-amber-100 shadow-sm animate-bounce">
          <AlertTriangle size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 border-none">Something Went Wrong</h1>
          <p className="text-slate-500 font-medium leading-relaxed italic">
            "Error: {error?.message || 'Unexpected server fault'}"
          </p>
          <p className="text-slate-400 text-sm">
            Please try resetting the state or contact support if the issue persists.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => reset()} className="w-full bg-slate-900 hover:bg-black font-semibold shadow-lg">
            <RotateCcw size={16} className="mr-2" /> Reset Application
          </Button>
          <Button variant="ghost" asChild className="w-full text-slate-500 hover:text-slate-700">
            <a href="mailto:support@jspm.edu" className="flex items-center gap-2 justify-center">
              <ShieldCheck size={16} /> Contact Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
