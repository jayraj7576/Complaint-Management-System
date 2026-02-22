'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ComplaintTable from '@/components/complaints/ComplaintTable';
import AdvancedSearch from '@/components/complaints/AdvancedSearch';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      if (params.search)               query.set('search', params.search);
      if (params.status?.length === 1) query.set('status', params.status[0]);
      if (params.dateFrom)             query.set('dateFrom', params.dateFrom);
      if (params.dateTo)               query.set('dateTo', params.dateTo);

      const response = await fetch(`/api/complaints/user?${query.toString()}`);
      const data = await response.json();
      if (data.success) {
        let results = data.complaints;

        // Client-side sort  (API already returns newest-first by default)
        if (params.sort === 'priority') {
          const ORDER = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          results = [...results].sort((a, b) =>
            params.order === 'desc'
              ? (ORDER[b.priority] || 0) - (ORDER[a.priority] || 0)
              : (ORDER[a.priority] || 0) - (ORDER[b.priority] || 0)
          );
        }

        // Client-side category filter (API /user doesn't expose category yet)
        if (params.category?.length) {
          results = results.filter((c) => params.category.includes(c.category));
        }

        setComplaints(results);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user, fetchComplaints]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Complaints</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track the status of your submitted complaints.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/complaints/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Complaint
          </Link>
        </Button>
      </div>

      {/* Advanced Search — built by Atharva, integrated by Jayraj */}
      <AdvancedSearch onSearchChange={fetchComplaints} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No complaints found</p>
          <p className="text-sm mt-1">Try adjusting your search filters or submit a new complaint.</p>
        </div>
      ) : (
        <ComplaintTable complaints={complaints} showUser={false} />
      )}
    </div>
  );
}
