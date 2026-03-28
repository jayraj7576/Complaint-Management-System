'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  UserPlus, 
  Trash2, 
  X,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const BulkActions = ({ selectedIds, onClear, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleBulkStatus = async (status) => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints/bulk/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintIds: selectedIds, status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Updated ${data.updatedCount} complaints to ${status}`);
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} complaints?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/complaints/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintIds: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted ${data.deletedCount} complaints`);
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 border border-slate-700">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
          <div className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
            {selectedIds.length}
          </div>
          <span className="text-sm font-medium text-slate-300">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 rounded-full px-4" disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-slate-900 text-white border-slate-700">
              <DropdownMenuItem onClick={() => handleBulkStatus('IN_PROGRESS')} className="hover:bg-slate-800 focus:bg-slate-800">
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkStatus('RESOLVED')} className="hover:bg-slate-800 focus:bg-slate-800">
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkStatus('REJECTED')} className="hover:bg-slate-800 focus:bg-slate-800">
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkStatus('ESCALATED')} className="hover:bg-slate-800 focus:bg-slate-800">
                Escalated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-red-900/40 hover:text-red-400 rounded-full px-4"
            disabled={loading}
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full" 
          onClick={onClear}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
