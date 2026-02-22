'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import StatusBadge from '@/components/complaints/StatusBadge';
import PriorityBadge from '@/components/complaints/PriorityBadge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminComplaintDetailsPage({ params: _params }) {
  const router = useRouter();
  const params = use(_params);
  const id = params?.id;
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for updating status/remark
  const [newStatus, setNewStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await fetch(`/api/complaints/${id}`);
      const data = await response.json();
      if (data.success) {
        setComplaint(data.complaint);
        setNewStatus(data.complaint.status);
      }
    } catch (err) {
      toast.error('Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, remark: remark.trim() || undefined }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Status updated successfully');
        setComplaint(data.complaint);
        setRemark('');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !complaint) return <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/complaints')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{complaint.title}</h1>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">
            Ticket ID: {complaint.ticketId} · Raised by {complaint.userId?.name} ({complaint.userId?.email})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{complaint.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b mb-4">
              <CardTitle>History & Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complaint.remarks?.map((rmk, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">{rmk.userId?.name || 'Admin'}</span>
                    <span className="text-xs text-slate-500">{format(new Date(rmk.createdAt), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <p className="text-sm text-slate-700">{rmk.content}</p>
                </div>
              ))}
              {(!complaint.remarks || complaint.remarks.length === 0) && (
                <p className="text-sm text-slate-500 italic text-center py-4">No remarks yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50/50 rounded-t-lg">
              <CardTitle className="text-lg">Update Action</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Change Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="ESCALATED">Escalated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Add Remark (Required to update)</label>
                    <Textarea 
                        placeholder="Internal note or user update..." 
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="resize-none h-24"
                    />
                </div>

                <Button 
                    className="w-full" 
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || !remark.trim()}
                >
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Update Complaint
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Category</span>
                <span className="font-medium">{complaint.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Priority</span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Department</span>
                <span className="font-medium text-right max-w-[150px] truncate">{complaint.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted</span>
                <span className="font-medium">{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
