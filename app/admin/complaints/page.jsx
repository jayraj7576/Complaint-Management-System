'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ComplaintTable from '@/components/complaints/ComplaintTable';
import BulkActions from '@/components/admin/BulkActions';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/complaints';
      const params = new URLSearchParams();
      
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      
      if (params.toString()) {
         url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error('Failed to fetch all complaints:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Client-side search filtering
  const filteredComplaints = complaints.filter(c => {
     if (!searchTerm) return true;
     const term = searchTerm.toLowerCase();
     return (
        c.title.toLowerCase().includes(term) ||
        c.ticketId.toLowerCase().includes(term) ||
        (c.userId?.name && c.userId.name.toLowerCase().includes(term))
     );
  });

  const handleBulkSuccess = () => {
    setSelectedIds([]);
    fetchComplaints();
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {user?.role === 'ADMIN' ? 'All Complaints' : `${user?.department} Complaints`}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {user?.role === 'ADMIN' ? 'Manage, filter, and review all system complaints.' : `Manage, filter, and review complaints from your department.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading === false && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              Synced & Verified
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchComplaints} 
            disabled={loading}
            className="rounded-full px-4 border-slate-200 hover:bg-slate-50 transition-all font-bold shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white rounded-xl border shadow-sm">
        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Search</label>
            <Input
                placeholder="Search ticket, title, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border-transparent focus:bg-white focus:border-blue-400 transition-all"
            />
        </div>
        
        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-all"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent className="bg-white border-slate-100 shadow-2xl p-2 text-slate-900">
                <SelectItem value="ALL" className="rounded-xl font-medium hover:bg-slate-50">All Statuses</SelectItem>
                <SelectItem value="PENDING" className="rounded-xl font-medium hover:bg-slate-50">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS" className="rounded-xl font-medium hover:bg-slate-50">In Progress</SelectItem>
                <SelectItem value="RESOLVED" className="rounded-xl font-medium hover:bg-slate-50">Resolved</SelectItem>
                <SelectItem value="ESCALATED" className="rounded-xl font-medium hover:bg-slate-50">Escalated</SelectItem>
                <SelectItem value="REJECTED" className="rounded-xl font-medium hover:bg-slate-50">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-all"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent className="bg-white border-slate-100 shadow-2xl p-2 text-slate-900">
                <SelectItem value="ALL" className="rounded-xl font-medium hover:bg-slate-50">All Categories</SelectItem>
                <SelectItem value="INFRASTRUCTURE" className="rounded-xl font-medium hover:bg-slate-50">Infrastructure</SelectItem>
                <SelectItem value="ACADEMIC" className="rounded-xl font-medium hover:bg-slate-50">Academic</SelectItem>
                <SelectItem value="LIBRARY" className="rounded-xl font-medium hover:bg-slate-50">Library</SelectItem>
                <SelectItem value="HOSTEL" className="rounded-xl font-medium hover:bg-slate-50">Hostel</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-all"><SelectValue placeholder="All Priorities" /></SelectTrigger>
                <SelectContent className="bg-white border-slate-100 shadow-2xl p-2 text-slate-900">
                <SelectItem value="ALL" className="rounded-xl font-medium hover:bg-slate-50">All Priorities</SelectItem>
                <SelectItem value="LOW" className="rounded-xl font-medium hover:bg-slate-50">Low</SelectItem>
                <SelectItem value="MEDIUM" className="rounded-xl font-medium hover:bg-slate-50">Medium</SelectItem>
                <SelectItem value="HIGH" className="rounded-xl font-medium hover:bg-slate-50">High</SelectItem>
                <SelectItem value="URGENT" className="rounded-xl font-medium hover:bg-slate-50">Urgent</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {loading && complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed rounded-xl">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-500 animate-pulse">Fetching latest complaints...</p>
        </div>
      ) : (
        <ComplaintTable 
            complaints={filteredComplaints} 
            showUser={true} 
            basePath="/admin/complaints"
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
        />
      )}

      <BulkActions 
        selectedIds={selectedIds} 
        onClear={() => setSelectedIds([])} 
        onSuccess={handleBulkSuccess}
      />
    </div>
  );
}
