'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { LayoutDashboard, FileText, Users, BarChart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push(user ? '/dashboard' : '/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'All Complaints', href: '/admin/complaints', icon: FileText },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Reports', href: '#', icon: BarChart }, // Placeholder
    { label: 'Settings', href: '#', icon: Settings }, // Placeholder
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <Sidebar items={sidebarItems} className="bg-slate-900 border-none text-white [&_.bg-slate-200]:bg-slate-800 [&_.bg-slate-200]:text-white [&_button]:text-slate-300 [&_button:hover]:bg-slate-800 [&_button:hover]:text-white [&_h2]:text-slate-400" />

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="border-b bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 md:hidden">
              Admin Area
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium mr-2 hidden md:block">
              {user.name} (Administrator)
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
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
