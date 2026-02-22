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

const ComplaintTable = ({ complaints, showUser = false, basePath = '/dashboard/complaints' }) => {
  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 border rounded-md">
        <p className="text-slate-500 mb-4">No complaints found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            {showUser && <TableHead>Submitted By</TableHead>}
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint._id}>
              <TableCell className="font-mono text-sm">{complaint.ticketId}</TableCell>
              <TableCell className="font-medium">
                <div className="truncate max-w-[250px]" title={complaint.title}>
                  {complaint.title}
                </div>
              </TableCell>
              {showUser && (
                <TableCell>
                  <div className="truncate max-w-[150px]">
                    {complaint.userId?.name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {complaint.userId?.email || ''}
                  </div>
                </TableCell>
              )}
              <TableCell>
                <span className="text-xs uppercase bg-slate-100 px-2 py-1 rounded">
                  {complaint.category.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={complaint.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={complaint.priority} />
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
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
