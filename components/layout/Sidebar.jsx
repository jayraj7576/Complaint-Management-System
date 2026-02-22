'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';

const Sidebar = ({ items, className }) => {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-64 hidden md:flex flex-col border-r min-h-screen bg-slate-50", className)}>
      {/* Top: Logo / App name + Bell */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <span className="text-base font-bold text-slate-800 tracking-tight">CMS</span>
        <NotificationBell />
      </div>

      {/* Navigation links */}
      <div className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              pathname === item.href && 'bg-slate-200'
            )}
            asChild
          >
            <Link href={item.href}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
