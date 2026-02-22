'use client';

import React, { useEffect, useState } from 'react';
import ComplaintTable from '@/components/complaints/ComplaintTable';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    const fetchComplaints = async () => {
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
    };

    fetchComplaints();
  }, [statusFilter, categoryFilter, priorityFilter]);

  // Client-side search filtering (could be done server-side as well)
  const filteredComplaints = complaints.filter(c => {
     if (!searchTerm) return true;
     const term = searchTerm.toLowerCase();
     return (
        c.title.toLowerCase().includes(term) ||
        c.ticketId.toLowerCase().includes(term) ||
        (c.userId?.name && c.userId.name.toLowerCase().includes(term))
     );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Complaints</h1>
        <p className="text-sm text-slate-500 mt-1">Manage, filter, and review all system complaints.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border">
        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Search</label>
            <Input
                placeholder="Search ticket, title, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                <SelectItem value="ACADEMIC">Academic</SelectItem>
                <SelectItem value="LIBRARY">Library</SelectItem>
                <SelectItem value="HOSTEL">Hostel</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
             <label className="text-xs font-medium text-slate-500">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger><SelectValue placeholder="All Priorities" /></SelectTrigger>
                <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <ComplaintTable 
            complaints={filteredComplaints} 
            showUser={true} 
            basePath="/admin/complaints" 
        />
      )}
    </div>
  );
}
