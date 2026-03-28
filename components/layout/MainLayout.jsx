'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { LayoutDashboard, FileText, PlusCircle, User, Bell, LogOut, Users, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function MainLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-600">Syncing with system...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = user?.role?.toUpperCase() === 'ADMIN' ? [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'All Complaints', href: '/admin/complaints', icon: FileText },
    { label: 'Users & Staff', href: '/admin/users', icon: Users },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'My Profile', href: '/profile', icon: User },
  ] : [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Complaint', href: '/complaints/new', icon: PlusCircle },
    { label: 'My Complaints', href: '/complaints', icon: FileText },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <Sidebar items={sidebarItems} />

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="border-b bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-400 md:hidden">
              CMS
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-bold text-slate-600 mr-2 hidden md:block">
              Welcome, <span className="text-blue-600">{user.name}</span> ({user.role})
            </div>
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={logout} className="font-bold border-2 hover:bg-slate-50">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
