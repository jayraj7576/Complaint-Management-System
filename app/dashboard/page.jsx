'use client';

import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Users, BarChart, Plus, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch(user.role === 'USER' ? '/api/complaints/user' : '/api/complaints')
      ]);

      const statsData = await statsRes.json();
      const complaintsData = await complaintsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (complaintsData.success) {
        // Only show last 5 for dashboard
        setComplaints(complaintsData.complaints.slice(0, 5));
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const statsConfig = [
    { title: 'Total Tickets', value: stats?.total || 0, icon: FileText, color: 'bg-blue-600', trend: 'Total volume' },
    { title: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'bg-amber-500', trend: 'Needs action' },
    { title: 'In Progress', value: stats?.inProgress || 0, icon: AlertTriangle, color: 'bg-orange-600', trend: 'Active' },
    { title: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle, color: 'bg-emerald-600', trend: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Segment */}
      <div className="mb-8 border-b bg-white px-8 py-6 shadow-xs">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Welcome back, {user.name} <span className="mx-1 opacity-20">|</span> <span className="text-blue-600 font-extrabold">{user.role.replace('_', ' ')}</span>
        </p>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl shadow-sm border-none bg-white" />
            ))
          ) : (
            statsConfig.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
              />
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complaints List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                Recent Activity
                {complaints.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{complaints.length}</span>}
              </h2>
              <Button variant="link" onClick={() => router.push(user.role === 'USER' ? '/complaints' : '/admin/complaints')} className="text-blue-600 font-bold hover:no-underline">
                View All
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl border p-2 shadow-sm">
                {loading ? (
                    <div className="space-y-4 p-4">
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                    </div>
                ) : (
                    <ComplaintList complaints={complaints} userRole={user.role} />
                )}
            </div>
          </div>

          {/* Quick Actions Side Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              {user.role === 'USER' && (
                <Button onClick={() => router.push('/complaints/new')} className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-6 font-bold text-md shadow-md">
                  <Plus className="mr-2 h-5 w-5" />
                  File New Complaint
                </Button>
              )}
              {(user.role === 'ADMIN' || user.role === 'DEPARTMENT_HEAD') && (
                <>
                  <Button onClick={() => router.push('/admin/complaints')} className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl py-6 font-bold text-md shadow-md text-white">
                    <BarChart className="mr-2 h-5 w-5" />
                    Manage Complaints
                  </Button>
                  {user.role === 'ADMIN' && (
                  <Button onClick={() => router.push('/admin/settings')} variant="outline" className="w-full rounded-xl py-6 font-bold text-md border-2 hover:bg-slate-50 border-slate-200 text-slate-700">
                    <Users className="mr-2 h-5 w-5" />
                    System Settings
                  </Button>
                  )}
                </>
              )}
            </div>

            {/* Platform Health/Info */}
            <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl">
                 <h3 className="font-bold flex items-center gap-2 mb-2 text-slate-100">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Platform Status
                 </h3>
                 <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    All systems are operational. Average resolution time for high priority tickets is currently <span className="text-blue-400 font-bold">14 hours</span>.
                 </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
