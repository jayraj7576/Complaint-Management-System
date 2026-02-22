'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { LayoutDashboard, FileText, PlusCircle, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Complaint', href: '/dashboard/complaints/new', icon: PlusCircle },
    { label: 'My Complaints', href: '/dashboard/complaints', icon: FileText },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      {/* Mobile Header hidden for brevity here, handled inside pages */}
      
      {/* Sidebar for Desktop */}
      <Sidebar items={sidebarItems} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="border-b bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 md:hidden">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium mr-2 hidden md:block">
              Welcome, {user.name} ({user.role})
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
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
