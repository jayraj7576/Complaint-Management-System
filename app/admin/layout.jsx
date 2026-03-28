'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { LayoutDashboard, FileText, Users, BarChart, Settings, LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!user || (user.role !== 'ADMIN' && user.role !== 'DEPARTMENT_HEAD'))) {
      router.push(user ? '/dashboard' : '/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-600">Syncing with system...</p>
        </div>
      </div>
    );
  }

  const allSidebarItems = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN', 'DEPARTMENT_HEAD'] },
    { label: 'All Complaints', href: '/admin/complaints', icon: FileText, roles: ['ADMIN', 'DEPARTMENT_HEAD'] },
    { label: 'Users & Staff', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { label: 'System Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
    { label: 'Notifications', href: '/notifications', icon: Bell, roles: ['ADMIN', 'DEPARTMENT_HEAD'] },
    { label: 'My Profile', href: '/profile', icon: User, roles: ['ADMIN', 'DEPARTMENT_HEAD'] },
  ];

  const sidebarItems = allSidebarItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <Sidebar 
        items={sidebarItems} 
        className="bg-white border-r shadow-sm" 
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="border-b bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-400 md:hidden uppercase">
              {user?.role?.replace('_', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium mr-2 hidden md:block">
              {user.name} <span className="text-slate-400 font-bold ml-1">({user.role === 'ADMIN' ? 'Administrator' : 'Department Head'})</span>
            </div>
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={logout} className="font-bold border-2 hover:bg-slate-50">
               <LogOut className="h-4 w-4 mr-2" />
               Logout
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
