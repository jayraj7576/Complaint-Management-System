'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '@/components/dashboard/StatsCard';
import ComplaintTable from '@/components/complaints/ComplaintTable';
import { FileText, Clock, AlertTriangle, CheckCircle, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/complaints?limit=10');
        const data = await response.json();
        
        if (data.success) {
          setStats({
            total: data.total,
            pending: data.pending,
            inProgress: data.inProgress,
            resolved: data.resolved,
          });
          setRecentComplaints(data.complaints.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: FileText, colorClass: 'text-blue-600' },
    { title: 'Pending', value: stats.pending, icon: Clock, colorClass: 'text-amber-600' },
    { title: 'In Progress', value: stats.inProgress, icon: AlertTriangle, colorClass: 'text-sky-600' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle, colorClass: 'text-emerald-600' },
  ];

  if (loading) {
     return (
        <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800 mx-auto" />
        </div>
     );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
        <p className="text-sm text-slate-500 mt-1">System-wide metrics and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Complaints</h2>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/complaints">View All</Link>
            </Button>
          </div>
          <ComplaintTable 
            complaints={recentComplaints} 
            showUser={true} 
            basePath="/admin/complaints" 
          />
        </div>
        
        <div className="w-full md:w-80 space-y-4 hidden lg:block">
            <div className="bg-slate-50 border rounded-lg p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <UsersIcon className="h-4 w-4 text-slate-500" />
                    Quick Actions
                </h3>
                <div className="space-y-3">
                    <Button className="w-full justify-start" variant="secondary" asChild>
                       <Link href="/admin/users">Manage Users</Link>
                    </Button>
                    <Button className="w-full justify-start" variant="secondary" asChild>
                       <Link href="/admin/complaints?status=PENDING">Review Pending</Link>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
