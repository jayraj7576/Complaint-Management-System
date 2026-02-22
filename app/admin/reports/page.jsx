'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileBarChart2, Clock, CheckCircle2, AlertCircle, Users } from 'lucide-react';
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

// Helper — compute last 6 months data from complaints array
function getMonthlyTrend(complaints) {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      monthNum: d.getMonth(),
      total: 0,
      resolved: 0,
    });
  }
  complaints.forEach((c) => {
    const d = new Date(c.createdAt);
    const m = months.find(
      (m) => m.year === d.getFullYear() && m.monthNum === d.getMonth()
    );
    if (m) {
      m.total++;
      if (c.status === 'RESOLVED') m.resolved++;
    }
  });
  return months;
}

export default function AdminReportsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '500' });
      if (startDate) params.set('dateFrom', startDate);
      if (endDate)   params.set('dateTo', endDate);
      const res = await fetch(`/api/complaints?${params}`);
      const data = await res.json();
      if (data.success) setComplaints(data.complaints);
    } catch (_) {}
    finally { setLoading(false); }
  }, [startDate, endDate]);

  useEffect(() => { fetchData(); }, []);

  // ── Computed stats ──────────────────────────────────────────────
  const total      = complaints.length;
  const resolved   = complaints.filter((c) => c.status === 'RESOLVED').length;
  const pending    = complaints.filter((c) => c.status === 'PENDING').length;
  const escalated  = complaints.filter((c) => c.status === 'ESCALATED').length;
  const resRate    = total ? Math.round((resolved / total) * 100) : 0;

  // Average resolution time (days) for resolved complaints
  const avgDays = (() => {
    const resolved_ = complaints.filter((c) => c.status === 'RESOLVED' && c.resolvedAt);
    if (!resolved_.length) return '—';
    const sum = resolved_.reduce((acc, c) => {
      const diff = new Date(c.resolvedAt) - new Date(c.createdAt);
      return acc + diff / (1000 * 60 * 60 * 24);
    }, 0);
    return (sum / resolved_.length).toFixed(1) + ' days';
  })();

  // Status pie data
  const statusData = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Category bar data
  const categoryData = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name: name.replace('_', ' '), count }));

  // Monthly trend line data
  const monthlyData = getMonthlyTrend(complaints);

  // Department bar data
  const deptData = Object.entries(
    complaints.reduce((acc, c) => {
      const dept = c.department || 'Unassigned';
      if (!acc[dept]) acc[dept] = { total: 0, resolved: 0 };
      acc[dept].total++;
      if (c.status === 'RESOLVED') acc[dept].resolved++;
      return acc;
    }, {})
  ).map(([dept, v]) => ({ dept, ...v }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart2 className="h-6 w-6" />
            Reports &amp; Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Comprehensive overview of complaint data</p>
        </div>
        <ExportButtons startDate={startDate} endDate={endDate} />
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="pt-5">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            onApply={fetchData}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportCard title="Total Complaints" value={total} icon={FileBarChart2} color="blue" />
        <ReportCard title="Resolved" value={resolved} subtitle={`${resRate}% resolution rate`} icon={CheckCircle2} color="green" />
        <ReportCard title="Pending" value={pending} icon={AlertCircle} color="yellow" />
        <ReportCard title="Avg Resolution Time" value={avgDays} icon={Clock} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Complaints by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={85} label>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Complaints" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Department-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {deptData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                No department data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={deptData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-slate-500 text-left">
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium text-right">Resolved</th>
                  <th className="pb-2 font-medium text-right">Pending</th>
                  <th className="pb-2 font-medium text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((row, i) => {
                  const catComplaints = complaints.filter((c) =>
                    c.category?.replace('_', ' ') === row.name
                  );
                  const res = catComplaints.filter((c) => c.status === 'RESOLVED').length;
                  const pen = catComplaints.filter((c) => c.status === 'PENDING').length;
                  const rate = catComplaints.length ? Math.round((res / catComplaints.length) * 100) : 0;
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-2 font-medium capitalize">{row.name.toLowerCase()}</td>
                      <td className="py-2 text-right">{row.count}</td>
                      <td className="py-2 text-right text-green-600">{res}</td>
                      <td className="py-2 text-right text-yellow-600">{pen}</td>
                      <td className="py-2 text-right">
                        <span className={`text-xs font-semibold ${rate >= 70 ? 'text-green-600' : rate >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {rate}%
                        </span>
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
