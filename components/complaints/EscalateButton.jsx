'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EscalateButton({ complaintId, status, onEscalated }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Can only escalate if not already escalated/resolved/rejected
  const canEscalate = !['ESCALATED', 'RESOLVED', 'REJECTED'].includes(status);

  if (!canEscalate) return null;

  const handleEscalate = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for escalation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/complaints/${complaintId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim(), escalateTo: 'DEPARTMENT_HEAD' }),
      });

      const data = await res.json();

      if (data.success) {
        setOpen(false);
        setReason('');
        if (onEscalated) onEscalated();
      } else {
        setError(data.error || 'Escalation failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
      >
        <AlertTriangle className="h-4 w-4" />
        Escalate
      </Button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Escalate Complaint</h3>
                <p className="text-sm font-medium text-slate-500">Notifying the Department Head</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason for Escalation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g., No action taken for 7 days..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <div className="flex gap-3 justify-end mt-8">
              <Button 
                variant="ghost" 
                onClick={() => { setOpen(false); setReason(''); setError(''); }}
                className="font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEscalate}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl px-6 shadow-lg shadow-orange-100 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Escalate Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
