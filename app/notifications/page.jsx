'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationList from '@/components/notifications/NotificationList';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';

const TABS = ['All', 'Unread', 'STATUS_UPDATE', 'NEW_REMARK', 'COMPLAINT_ASSIGNED', 'COMPLAINT_RESOLVED'];
const TAB_LABELS = {
  All: 'All',
  Unread: 'Unread',
  STATUS_UPDATE: 'Status Updates',
  NEW_REMARK: 'Comments',
  COMPLAINT_ASSIGNED: 'Assigned',
  COMPLAINT_RESOLVED: 'Resolved',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = async (pg = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${pg}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setTotalPages(data.pagination?.pages || 1);
        setPage(pg);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleMarkRead = async (notification) => {
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification._id}`, { method: 'PUT' });
        setNotifications((prev) =>
          prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    if (notification.complaintId) {
      router.push(`/complaints/${notification.complaintId}`);
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.isRead;
    return n.type === activeTab;
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 border-none">Updates & Alerts</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-medium text-slate-500">Stay informed about your complaints</p>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white border-none font-bold animate-pulse">
                    {unreadCount} New
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllRead} 
              className="flex items-center gap-2 font-bold border-2 hover:bg-slate-50 rounded-xl"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                 setActiveTab(tab);
                 setPage(1);
              }}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-2xl border-none shadow-xl ring-1 ring-black/5 overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-slate-400 font-bold animate-pulse">Retrieving updates...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">All caught up!</h3>
                <p className="text-slate-400 text-sm max-w-xs mt-1 font-medium">No {activeTab.toLowerCase()} notifications to show right now.</p>
            </div>
          ) : (
            <NotificationList notifications={filtered} onMarkRead={handleMarkRead} />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => fetchNotifications(page - 1)}
              className="font-bold rounded-xl border-2"
            >
              Previous
            </Button>
            <div className="bg-white px-4 py-1.5 rounded-full border shadow-sm text-xs font-bold text-slate-600">
                Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => fetchNotifications(page + 1)}
              className="font-bold rounded-xl border-2"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
