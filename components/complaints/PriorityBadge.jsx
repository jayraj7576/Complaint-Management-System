import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (currentPriority) => {
    switch (currentPriority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
        priority
      )}`}
    >
      {priority || 'UNKNOWN'}
    </span>
  );
};

export default PriorityBadge;
