'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Sidebar = ({ items, className }) => {
  const pathname = usePathname();

  return (
    <div className={cn("hidden md:flex flex-col w-72 border-r bg-white h-screen sticky top-0 transition-all duration-300", className)}>
      {/* Top: Logo / Branding Control */}
      <div className="px-8 py-10 flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-100">
            <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">CMS</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Authorized</p>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Console</div>
        {items.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link key={item.href} href={item.href} className="block group">
                    <div className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden",
                        isActive 
                            ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}>
                        {item.icon && <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />}
                        <span className="text-sm tracking-tight">{item.label}</span>
                        {isActive && <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-600 rounded-l-full" />}
                    </div>
                </Link>
            );
        })}
      </div>
      
      {/* Bottom padding */}
      <div className="p-8">
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Protocol</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-600">Encrypted Session</span>
            </div>
         </div>
      </div>
    </div>
  );
};

function Shield(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
    );
}

export default Sidebar;
