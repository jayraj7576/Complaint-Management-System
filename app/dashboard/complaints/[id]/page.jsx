'use client';

import React, { useEffect, useState, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import StatusBadge from '@/components/complaints/StatusBadge';
import PriorityBadge from '@/components/complaints/PriorityBadge';
import { format } from 'date-fns';

export default function ComplaintDetailsPage({ params: _params }) {
  const router = useRouter();
  const params = use(_params);
  const id = params?.id;
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(`/api/complaints/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setComplaint(data.complaint);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaint();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Complaint Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "The complaint you're looking for doesn't exist or you don't have permission to view it."}</p>
        <Button onClick={() => router.push('/dashboard/complaints')}>
          Return to My Complaints
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/complaints')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{complaint.title}</h1>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">Ticket ID: {complaint.ticketId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap">{complaint.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Updates & Remarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.remarks && complaint.remarks.length > 0 ? (
                <div className="space-y-4">
                  {complaint.remarks.map((remark, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 border relative">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm text-slate-900">
                          {remark.userId?.name || 'Administrator'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {format(new Date(remark.createdAt), 'MMM d, yyyy · h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{remark.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No remarks or updates yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Category</dt>
                <dd className="mt-1 text-sm font-semibold capitalize">{complaint.category.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Priority</dt>
                <dd className="mt-1">
                  <PriorityBadge priority={complaint.priority} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Department</dt>
                <dd className="mt-1 text-sm font-semibold">{complaint.department}</dd>
              </div>
              <div className="pt-4 border-t">
                <dt className="text-sm font-medium text-slate-500">Submitted On</dt>
                <dd className="mt-1 text-sm flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                </dd>
              </div>
              {complaint.resolvedAt && (
                <div className="pt-4 border-t">
                  <dt className="text-sm font-medium text-slate-500">Resolved On</dt>
                  <dd className="mt-1 text-sm text-green-600 font-medium">
                    {format(new Date(complaint.resolvedAt), 'MMM d, yyyy')}
                  </dd>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
