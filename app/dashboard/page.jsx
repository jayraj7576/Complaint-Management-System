'use client';

import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Users, BarChart, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Role-based stats configuration
  const getStatsForRole = () => {
    if (user.role === 'ADMIN') {
      return [
        { title: 'Total Complaints', value: '0', icon: FileText, color: 'bg-blue-500', trend: 'All time' },
        { title: 'Pending Review', value: '0', icon: Clock, color: 'bg-yellow-500', trend: 'Awaiting assignment' },
        { title: 'In Progress', value: '0', icon: AlertTriangle, color: 'bg-orange-500', trend: 'Being resolved' },
        { title: 'Resolved', value: '0', icon: CheckCircle, color: 'bg-green-500', trend: 'This month' },
      ];
    } else if (user.role === 'DEPARTMENT_HEAD') {
      return [
        { title: 'Department Complaints', value: '0', icon: FileText, color: 'bg-blue-500', trend: user.department || 'All' },
        { title: 'Assigned to Staff', value: '0', icon: Users, color: 'bg-purple-500', trend: 'Active assignments' },
        { title: 'Pending Action', value: '0', icon: Clock, color: 'bg-yellow-500', trend: 'Needs attention' },
        { title: 'Resolved', value: '0', icon: CheckCircle, color: 'bg-green-500', trend: 'This month' },
      ];
    } else {
      return [
        { title: 'My Complaints', value: '0', icon: FileText, color: 'bg-blue-500', trend: 'Total filed' },
        { title: 'Pending', value: '0', icon: Clock, color: 'bg-yellow-500', trend: 'Awaiting response' },
        { title: 'In Progress', value: '0', icon: AlertTriangle, color: 'bg-orange-500', trend: 'Being resolved' },
        { title: 'Resolved', value: '0', icon: CheckCircle, color: 'bg-green-500', trend: 'Completed' },
      ];
    }
  };

  const stats = getStatsForRole();

  // Role-based quick actions
  const getQuickActions = () => {
    if (user.role === 'ADMIN') {
      return (
        <div className="flex flex-wrap gap-3">
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Manage Users (Coming Soon)
          </Button>
          <Button variant="outline" disabled>
            <BarChart className="mr-2 h-4 w-4" />
            Generate Reports (Coming Soon)
          </Button>
        </div>
      );
    } else if (user.role === 'DEPARTMENT_HEAD') {
      return (
        <div className="flex flex-wrap gap-3">
          <Button disabled>
            <Users className="mr-2 h-4 w-4" />
            Assign to Staff (Coming Soon)
          </Button>
          <Button variant="outline" disabled>
            <BarChart className="mr-2 h-4 w-4" />
            Department Reports (Coming Soon)
          </Button>
        </div>
      );
    } else {
      return (
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          File New Complaint (Coming Soon)
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user.name} ({user.role})
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          {getQuickActions()}
        </div>

        {/* Complaints List */}
        <ComplaintList complaints={[]} userRole={user.role} />
      </main>
    </div>
  );
}
