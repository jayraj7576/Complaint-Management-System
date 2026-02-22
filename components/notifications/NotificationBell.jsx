'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, ArrowRight, Circle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatTimeAgo } from '@/lib/dateUtils';

const typeIcons = {
  STATUS_UPDATE: '🔄',
  NEW_REMARK: '💬',
  COMPLAINT_ASSIGNED: '👤',
  COMPLAINT_RESOLVED: '✅',
  SYSTEM: '⚙️',
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=5');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await fetch(`/api/notifications/${notification._id}`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    setOpen(false);
    if (notification.complaintId) {
      router.push(`/dashboard/complaints/${notification.complaintId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 z-50 w-[350px] max-h-[400px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors"
              >
                <span className="text-lg mt-0.5 flex-shrink-0">
                  {typeIcons[notification.type] || '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <Circle className="h-2 w-2 text-blue-500 fill-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))
          )}

          {/* Footer */}
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 py-3 text-sm text-blue-600 hover:text-blue-700 font-medium border-t"
          >
            View all notifications
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
