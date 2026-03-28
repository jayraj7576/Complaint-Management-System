'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ArrowLeft, 
  Send, 
  User as UserIcon, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  UserPlus,
  Download
} from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';

export default function AdminComplaintDetailsPage({ params: _params }) {
  const router = useRouter();
  const params = use(_params);
  const id = params?.id;
  const { user: currentUser } = useAuth();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  
  // State for updating status/remark
  const [newStatus, setNewStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // State for Assignment
  const [isAssigning, setIsAssigning] = useState(false);

  // State for Remark Editing
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [editRemarkContent, setEditRemarkContent] = useState('');
  const [isEditingRemark, setIsEditingRemark] = useState(false);

  useEffect(() => {
    if (id) {
        fetchComplaint();
        fetchStaff();
    }
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

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/users/staff');
      const data = await res.json();
      if (data.success) {
        setStaff(data.staff);
      }
    } catch (err) {
      console.error('Failed to fetch staff members');
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
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
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

  const handleAssign = async (staffId) => {
    try {
      setIsAssigning(true);
      const res = await fetch(`/api/complaints/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: staffId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Complaint assigned successfully');
        setComplaint(prev => ({ ...prev, assignedTo: data.assignedTo }));
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateRemark = async (remarkId) => {
    try {
      setIsEditingRemark(true);
      const res = await fetch(`/api/complaints/${id}/remarks/${remarkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editRemarkContent }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Remark updated');
        setComplaint(prev => ({
          ...prev,
          remarks: prev.remarks.map(r => r._id === remarkId ? { ...r, content: editRemarkContent } : r)
        }));
        setEditingRemarkId(null);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to update remark');
    } finally {
      setIsEditingRemark(false);
    }
  };

  const handleDeleteRemark = async (remarkId) => {
    if (!confirm('Are you sure you want to delete this remark?')) return;
    try {
      const res = await fetch(`/api/complaints/${id}/remarks/${remarkId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Remark removed');
        setComplaint(prev => ({
          ...prev,
          remarks: prev.remarks.filter(r => r._id !== remarkId)
        }));
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Failed to delete remark');
    }
  };

  if (loading || !complaint) return <div className="p-24 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600 mb-4" /><p className="text-slate-400 font-bold animate-pulse tracking-widest uppercase text-xs">Accessing Complaint...</p></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/complaints')} className="hover:bg-white">
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

        <div className="flex items-center gap-3 bg-white p-2 border-2 border-slate-50 rounded-2xl shadow-sm">
             <div className="pl-3 py-1 mr-2 text-[10px] font-black uppercase text-slate-400 border-r pr-4">Assignment Control</div>
             <UserPlus className="h-4 w-4 text-slate-400 ml-1" />
             <Select 
                disabled={isAssigning}
                value={complaint.assignedTo?._id || complaint.assignedTo || 'none'} 
                onValueChange={handleAssign}
            >
                <SelectTrigger className="w-[200px] border-none bg-transparent hover:bg-slate-50 font-bold focus:ring-0">
                    <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                    <SelectItem value="none" className="rounded-xl py-2.5 font-bold text-slate-400">Unassigned</SelectItem>
                    {staff.map(s => (
                        <SelectItem key={s._id} value={s._id} className="rounded-xl py-2.5 font-bold">
                            {s.name} ({s.department})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isAssigning && <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Description */}
          <Card className="rounded-4xl border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Complaint Narrative</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-600 text-lg leading-relaxed font-medium whitespace-pre-wrap">{complaint.description}</p>
            </CardContent>
          </Card>

          {/* Remarks Section */}
          <Card className="rounded-4xl border-none shadow-2xl overflow-hidden relative">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Staff Commentary</CardTitle>
              <div className="bg-blue-50 px-4 py-1 rounded-full text-blue-600 font-black text-xs uppercase tracking-widest">{complaint.remarks?.length || 0} Total</div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                  {complaint.remarks?.map((rmk, idx) => (
                    <div key={idx} className="p-8 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                                {rmk.userId?.name?.slice(0, 2) || 'AD'}
                            </div>
                            <div>
                                <span className="font-black text-slate-900 block">{rmk.userId?.name || 'Authorized Member'}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(rmk.createdAt), 'MMM d, yyyy • h:mm a')}</span>
                            </div>
                        </div>
                        
                        {(() => {
                            const isAuthor = rmk.userId?._id === currentUser?._id;
                            const isAdmin = currentUser?.role === 'ADMIN';
                            const isDeptHead = currentUser?.role === 'DEPARTMENT_HEAD' && complaint.department === currentUser?.department;
                            
                            if (isAuthor || isAdmin || isDeptHead) {
                                return (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => {
                                                setEditingRemarkId(rmk._id);
                                                setEditRemarkContent(rmk.content);
                                            }}
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-white shadow-sm"
                                        >
                                            <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteRemark(rmk._id)}
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-white shadow-sm hover:text-red-600"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                                        </Button>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                      </div>
                      
                      {editingRemarkId === rmk._id ? (
                        <div className="space-y-3 mt-4">
                            <Textarea 
                                value={editRemarkContent}
                                onChange={(e) => setEditRemarkContent(e.target.value)}
                                className="border-2 border-blue-100 focus:border-blue-500 rounded-2xl resize-none p-4 font-medium"
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setEditingRemarkId(null)} className="font-bold text-slate-400">Cancel</Button>
                                <Button size="sm" onClick={() => handleUpdateRemark(rmk._id)} disabled={isEditingRemark} className="bg-blue-600 px-6 rounded-xl font-bold">
                                    {isEditingRemark ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                                    Save Update
                                </Button>
                            </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 font-medium leading-relaxed mt-2">{rmk.content}</p>
                      )}
                    </div>
                  ))}
                  {(!complaint.remarks || complaint.remarks.length === 0) && (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                            <Send className="h-6 w-6 text-slate-300 -rotate-12" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Silence in progress</h4>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1 font-medium italic">No internal remarks have been recorded for this ticket yet.</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <Card className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden p-6">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-widest uppercase text-slate-400 text-[10px]">Administrative Override</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New System State</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 font-bold rounded-2xl focus:ring-blue-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 bg-white text-slate-900">
                            <SelectItem value="PENDING" className="rounded-xl py-3 font-bold hover:bg-slate-50">Pending Authorization</SelectItem>
                            <SelectItem value="IN_PROGRESS" className="rounded-xl py-3 font-bold text-amber-600 hover:bg-amber-50">Under Investigation</SelectItem>
                            <SelectItem value="RESOLVED" className="rounded-xl py-3 font-bold text-green-600 hover:bg-green-50">Problem Corrected</SelectItem>
                            <SelectItem value="REJECTED" className="rounded-xl py-3 font-bold text-red-600 hover:bg-red-50">Submission Rejected</SelectItem>
                            <SelectItem value="ESCALATED" className="rounded-xl py-3 font-bold text-purple-600 hover:bg-purple-50">External Escalation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity Remark</label>
                    <Textarea 
                        placeholder="Log detail for status change..." 
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="resize-none h-32 bg-slate-50 border-slate-100 rounded-2xl p-4 font-medium placeholder:text-slate-400 focus-visible:ring-blue-500 shadow-inner"
                    />
                </div>

                <Button 
                    className="w-full h-14 bg-blue-600 text-white hover:bg-blue-700 font-black rounded-2xl shadow-xl shadow-blue-100 transition-all border-none active:scale-95" 
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || !remark.trim()}
                >
                    {isUpdating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                    Authorize State Change
                </Button>
            </CardContent>
          </Card>

          <Card className="rounded-4xl border-none shadow-xl shadow-slate-100 overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Classification</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</span>
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    {complaint.department}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filing Date</span>
                <span className="font-bold text-slate-700">{format(new Date(complaint.createdAt), 'MMMM d, yyyy')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function Building2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function ShieldCheck(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
