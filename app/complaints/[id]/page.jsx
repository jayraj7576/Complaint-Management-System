'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Download, Clock, MessageSquare, Info } from 'lucide-react';
import StatusBadge from '@/components/complaints/StatusBadge';
import PriorityBadge from '@/components/complaints/PriorityBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function UserComplaintDetailsPage({ params: _params }) {
  const router = useRouter();
  const params = use(_params);
  const id = params?.id;
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await fetch(`/api/complaints/${id}`);
      const data = await response.json();
      if (data.success) {
        setComplaint(data.complaint);
      } else {
        toast.error(data.error || 'Complaint not found');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      window.open(`/api/complaints/${id}/report`, '_blank');
      toast.success('Generating report...');
    } catch (err) {
      toast.error('Failed to generate report');
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" /></div>;
  if (!complaint) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="hover:bg-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{complaint.title}</h1>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Ticket ID: <span className="font-mono text-blue-600 font-bold">{complaint.ticketId}</span>
              </p>
            </div>
          </div>
          <Button onClick={handleDownloadReport} size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardHeader className="border-b bg-white/50 flex flex-row items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Complaint Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardHeader className="pb-3 border-b bg-white/50 flex flex-row items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Administrative Remarks</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {complaint.remarks?.length > 0 ? (
                  complaint.remarks.map((rmk, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                      <div className="shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {rmk.userId?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{rmk.userId?.name || 'Administrator'}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {format(new Date(rmk.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{rmk.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 font-medium italic">Your complaint is pending review. Remarks will appear here once an administrator updates your case.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl ring-1 ring-black/5">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Ticket Metadata</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 font-medium">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Department</span>
                  <span className="text-slate-900 font-bold">{complaint.department}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-4">
                  <span className="text-slate-500">Category</span>
                  <span className="text-slate-900">{complaint.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-4">
                  <span className="text-slate-500">Priority Level</span>
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-4">
                  <span className="text-slate-500">Date Logged</span>
                  <span className="text-slate-900 font-bold">{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-2xl shadow-blue-200 space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Guaranteed Resolution
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                This grievance is assigned to the <strong>{complaint.department}</strong> unit. 
                Our institutional SLA ensures initial response within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
