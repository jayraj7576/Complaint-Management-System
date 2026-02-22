'use client';

import { Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatTimeAgo } from '@/lib/dateUtils';

const typeIcons = {
  STATUS_UPDATE: '🔄',
  NEW_REMARK: '💬',
  COMPLAINT_ASSIGNED: '👤',
  COMPLAINT_RESOLVED: '✅',
  SYSTEM: '⚙️',
};

export default function NotificationList({ notifications, onMarkRead }) {
  const router = useRouter();

  if (notifications.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-4xl mb-3">🔔</p>
        <p className="font-medium">No notifications yet</p>
        <p className="text-sm mt-1">You&apos;ll see notifications about your complaints here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {notifications.map((notification) => (
        <button
          key={notification._id}
          onClick={() => onMarkRead(notification)}
          className={`w-full text-left flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${
            !notification.isRead ? 'bg-blue-50/40' : ''
          }`}
        >
          <span className="text-2xl flex-shrink-0 mt-0.5">
            {typeIcons[notification.type] || '🔔'}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-800 text-sm">{notification.title}</p>
              {!notification.isRead && (
                <Circle className="h-2.5 w-2.5 text-blue-500 fill-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
            <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
