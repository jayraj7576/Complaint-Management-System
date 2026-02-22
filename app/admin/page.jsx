'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '@/components/dashboard/StatsCard';
import ComplaintTable from '@/components/complaints/ComplaintTable';
import StatusPieChart from '@/components/charts/StatusPieChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import DailyLineChart from '@/components/charts/DailyLineChart';
import { FileText, Clock, AlertTriangle, CheckCircle, Users as UsersIcon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [allComplaints, setAllComplaints] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/complaints?limit=50');
        const data = await response.json();

        if (data.success) {
          setStats({
            total: data.total,
            pending: data.pending,
            inProgress: data.inProgress,
            resolved: data.resolved,
          });
          setAllComplaints(data.complaints);
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={allComplaints} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              By Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={allComplaints} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Daily Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyLineChart data={allComplaints} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints + Quick Actions */}
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

        <div className="w-full md:w-72 space-y-4 hidden lg:block">
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
              <Button className="w-full justify-start" variant="secondary" asChild>
                <Link href="/admin/complaints?status=ESCALATED">View Escalated</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
