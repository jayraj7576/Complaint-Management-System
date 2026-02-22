import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ESCALATED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formattedStatus = status ? status.replace('_', ' ') : 'UNKNOWN';

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
        status
      )}`}
    >
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
