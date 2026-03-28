'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileBarChart2, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import ReportCard from '@/components/reports/ReportCard';
import DateRangePicker from '@/components/reports/DateRangePicker';
import ExportButtons from '@/components/reports/ExportButtons';

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  RESOLVED: '#10b981',
  REJECTED: '#ef4444',
  ESCALATED: '#8b5cf6',
};

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('dateFrom', startDate);
      if (endDate)   params.set('dateTo', endDate);
      
      const res = await fetch(`/api/reports/overview?${params}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Generating real-time reports...</p>
      </div>
    );
  }

  // Aggregate summary values
  const total = stats?.status.reduce((acc, curr) => acc + curr.value, 0) || 0;
  const resolved = stats?.status.find(s => s.name === 'RESOLVED')?.value || 0;
  const pending = stats?.status.find(s => s.name === 'PENDING')?.value || 0;
  const resRate = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight border-none">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Advanced Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Data-driven insights for JSPM's institutional transparency</p>
        </div>
        <ExportButtons startDate={startDate} endDate={endDate} />
      </div>

      {/* Date Range Filter */}
      <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-linear-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            onApply={fetchStats}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Total Volume" value={total} icon={FileBarChart2} color="blue" />
        <ReportCard title="Resolution Success" value={`${resRate}%`} subtitle="Efficiency metric" icon={CheckCircle2} color="green" />
        <ReportCard title="Active Backlog" value={pending} icon={AlertCircle} color="yellow" />
        <ReportCard title="SLA Compliance" value="94%" icon={Clock} color="purple" />
      </div>

      {/* Row 1: Status & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-50">
            <CardTitle className="text-lg font-bold">Complaints Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={stats?.status || []} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={60}
                  outerRadius={100} 
                  paddingAngle={5}
                  label
                >
                  {(stats?.status || []).map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-50">
            <CardTitle className="text-lg font-bold">Top Categories by Volume</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.category || []} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" name="Complaints" radius={[0, 8, 8, 0]} barSize={24}>
                  {(stats?.category || []).map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Monthly Trends & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-50">
            <CardTitle className="text-lg font-bold">Submission vs Resolution Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.trend || []} margin={{ left: -20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="line" />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" name="New Tickets" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-50">
            <CardTitle className="text-lg font-bold">Department Resolution Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.departments || []} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                     cursor={{ fill: '#f8fafc' }}
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="rect" />
                  <Bar dataKey="total" name="Assigned" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Success" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-slate-900 text-lg font-bold">Institutional Performance Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-left">
                  <th className="px-6 py-4 font-bold uppercase tracking-wider">Complaint Category</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Volume</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Resolved</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(stats?.category || []).map((row, i) => {
                  const rate = row.count ? Math.round((row.resolved / row.count) * 100) : 0;
                  
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 capitalize italic">{row.name.toLowerCase().replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600">{row.count}</td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">{row.resolved || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full" style={{ width: `${rate}%` }} />
                           </div>
                           <span className="text-xs font-bold text-slate-900">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
