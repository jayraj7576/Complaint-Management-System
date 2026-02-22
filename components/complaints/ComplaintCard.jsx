import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ComplaintCard = ({ complaint, basePath = '/dashboard/complaints' }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">
            <Link href={`${basePath}/${complaint._id}`} className="hover:underline">
              {complaint.title}
            </Link>
          </CardTitle>
          <div className="text-sm text-muted-foreground font-mono">
            {complaint.ticketId}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-slate-600 line-clamp-2 mt-2 mb-4">
          {complaint.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5" />
            <span className="truncate">{complaint.department}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Priority:</span>
          <PriorityBadge priority={complaint.priority} />
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`${basePath}/${complaint._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComplaintCard;
