'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

const ComplaintTable = ({ 
  complaints, 
  showUser = false, 
  basePath = '/dashboard/complaints',
  selectedIds = [],
  onSelectionChange
}) => {
  const isAllSelected = complaints?.length > 0 && selectedIds.length === complaints.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(complaints.map(c => c._id));
    }
  };

  const toggleOne = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 border border-dashed rounded-xl">
        <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <EyeIcon className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">No complaints found matching your criteria.</p>
        <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-[40px] px-4">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
            )}
            <TableHead className="w-[120px]">Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            {showUser && <TableHead>Submitted By</TableHead>}
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead className="text-right px-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint._id} className={selectedIds.includes(complaint._id) ? 'bg-blue-50/30' : ''}>
              {onSelectionChange && (
                <TableCell className="px-4">
                  <Checkbox 
                    checked={selectedIds.includes(complaint._id)}
                    onCheckedChange={() => toggleOne(complaint._id)}
                    aria-label={`Select ${complaint.ticketId}`}
                  />
                </TableCell>
              )}
              <TableCell className="font-mono text-sm text-slate-600">{complaint.ticketId}</TableCell>
              <TableCell className="font-medium text-slate-900">
                <div className="truncate max-w-[250px]" title={complaint.title}>
                  {complaint.title}
                </div>
              </TableCell>
              {showUser && (
                <TableCell>
                  <div className="truncate max-w-[150px] font-medium text-slate-800">
                    {complaint.userId?.name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-[150px]">
                    {complaint.userId?.email || ''}
                  </div>
                </TableCell>
              )}
              <TableCell>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {complaint.category.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={complaint.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={complaint.priority} />
              </TableCell>
              <TableCell className="text-sm text-slate-500">
                {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right px-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-blue-50 hover:text-blue-600 rounded-full h-8 w-8">
                  <Link href={`${basePath}/${complaint._id}`}>
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintTable;
