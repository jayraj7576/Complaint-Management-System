'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationList from '@/components/notifications/NotificationList';
import { useRouter } from 'next/navigation';

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
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setTotalPages(data.pagination.pages || 1);
        setPage(pg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PUT' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleMarkRead = async (notification) => {
    if (!notification.isRead) {
      await fetch(`/api/notifications/${notification._id}`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    if (notification.complaintId) {
      router.push(`/dashboard/complaints/${notification.complaintId}`);
    }
  };

  // Apply tab filter
  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.isRead;
    return n.type === activeTab;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500">{unreadCount} unread</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading notifications...</div>
        ) : (
          <NotificationList notifications={filtered} onMarkRead={handleMarkRead} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => fetchNotifications(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => fetchNotifications(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
