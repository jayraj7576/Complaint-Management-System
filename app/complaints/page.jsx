'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Plus, Search } from 'lucide-react';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function UserComplaintsListPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints/user');
      const data = await response.json();
      if (response.ok) {
        setComplaints(data.complaints || []);
      } else {
        toast.error(data.error || 'Failed to load complaints');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl shadow-blue-100/20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="hover:bg-white rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Complaints</h1>
              <p className="text-sm text-slate-500 font-medium">Manage and track all your grievances in one place.</p>
            </div>
          </div>
          <Button onClick={() => router.push('/complaints/new')} size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold rounded-2xl">
            <Plus className="mr-2 h-5 w-5" />
            New Complaint
          </Button>
        </div>

        <Card className="border-none shadow-2xl ring-1 ring-black/5 rounded-3xl overflow-hidden">
          <CardHeader className="bg-white/60 border-b p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Filter Grievances
              </CardTitle>
              <div className="relative w-full md:w-96">
                <Input 
                  placeholder="Search by Title or Ticket ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" /></div>
            ) : filteredComplaints.length > 0 ? (
              <div className="p-6">
                <ComplaintList complaints={filteredComplaints} userRole="USER" />
              </div>
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">No complaints found</h3>
                  <p className="text-sm text-slate-500">Try adjusting your search query or file a new one.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
