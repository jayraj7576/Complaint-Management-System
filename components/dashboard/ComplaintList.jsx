'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ComplaintList({ complaints = [], userRole }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', icon: Clock, label: 'Pending' },
      IN_PROGRESS: { variant: 'default', icon: AlertCircle, label: 'In Progress' },
      RESOLVED: { variant: 'success', icon: CheckCircle, label: 'Resolved' },
      REJECTED: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      ESCALATED: { variant: 'warning', icon: AlertCircle, label: 'Escalated' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'text-green-600',
      MEDIUM: 'text-yellow-600',
      HIGH: 'text-orange-600',
      URGENT: 'text-red-600',
    };
    return colors[priority] || colors.MEDIUM;
  };

  if (complaints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              No complaints found. {userRole === 'USER' ? 'Start by filing a new complaint.' : 'No complaints to display.'}
            </p>
            {userRole === 'USER' && (
              <Button disabled>File New Complaint (Coming Soon)</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{complaint.title}</h4>
                  {getStatusBadge(complaint.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Ticket: {complaint.ticketId}</span>
                  <span className={getPriorityColor(complaint.priority)}>
                    {complaint.priority} Priority
                  </span>
                  <span>{complaint.category}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
