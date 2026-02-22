'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComplaintForm from '@/components/complaints/ComplaintForm';
import FileUpload from '@/components/complaints/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewComplaintPage() {
  const router = useRouter();
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, attachments }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit complaint');
      }

      toast.success('Complaint submitted successfully', {
        description: `Ticket ID: ${data.complaint.ticketId}`,
      });

      router.push(`/dashboard/complaints/${data.complaint._id}`);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Complaint</h1>
        <p className="text-slate-500 mt-1">Please provide the details of your issue below.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ComplaintForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard')}
          />
        </CardContent>
      </Card>

      {/* File Attachment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attachments (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            attachments={attachments}
            onAttachmentsChange={setAttachments}
          />
        </CardContent>
      </Card>
    </div>
  );
}
