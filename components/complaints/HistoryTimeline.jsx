'use client';

import { formatTimeAgo, formatDate } from '@/lib/dateUtils';

const dotColors = {
  CREATED: 'bg-blue-500',
  STATUS_CHANGED: 'bg-green-500',
  REMARK_ADDED: 'bg-purple-500',
  ASSIGNED: 'bg-orange-500',
  PRIORITY_CHANGED: 'bg-red-500',
  ATTACHMENT_ADDED: 'bg-slate-400',
};

const dotIcons = {
  CREATED: '📝',
  STATUS_CHANGED: '🔄',
  REMARK_ADDED: '💬',
  ASSIGNED: '👤',
  PRIORITY_CHANGED: '⚡',
  ATTACHMENT_ADDED: '📎',
};

function getActionText(entry) {
  const user = entry.performedBy?.name || 'Someone';
  switch (entry.action) {
    case 'CREATED': return `Complaint submitted by ${user}`;
    case 'STATUS_CHANGED': return `Status changed from ${entry.previousValue} to ${entry.newValue} by ${user}`;
    case 'REMARK_ADDED': return `Comment added by ${user}`;
    case 'ASSIGNED': return `Assigned to ${entry.newValue} by ${user}`;
    case 'PRIORITY_CHANGED': return `Priority changed from ${entry.previousValue} to ${entry.newValue} by ${user}`;
    case 'ATTACHMENT_ADDED': return `Attachment added by ${user}`;
    default: return `Action performed by ${user}`;
  }
}

function groupByDate(history) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] };

  history.forEach((entry) => {
    const d = new Date(entry.timestamp);
    if (d >= today) groups['Today'].push(entry);
    else if (d >= yesterday) groups['Yesterday'].push(entry);
    else if (d >= weekAgo) groups['This Week'].push(entry);
    else groups['Older'].push(entry);
  });

  return groups;
}

export default function HistoryTimeline({ history = [] }) {
  if (history.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        No history available
      </div>
    );
  }

  const groups = groupByDate(history);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([label, entries]) => {
        if (entries.length === 0) return null;
        return (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 ml-8">
              {label}
            </p>
            <div className="relative space-y-4">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

              {entries.map((entry) => (
                <div key={entry._id} className="flex items-start gap-4">
                  {/* Dot */}
                  <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full ${dotColors[entry.action] || 'bg-slate-400'} flex items-center justify-center text-sm shadow-sm`}>
                    {dotIcons[entry.action] || '•'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-slate-700">{getActionText(entry)}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
