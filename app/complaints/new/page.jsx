'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ComplaintForm from '@/components/complaints/ComplaintForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NewComplaintPage() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Complaint filed successfully! Ticket ID: ${data.complaint.ticketId}`);
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="group mb-2 hover:bg-white/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">File a Grievance</h1>
            <p className="text-slate-500 font-medium">Please provide details about your complaint below.</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl ring-1 ring-black/5">
          <CardHeader className="border-b bg-white/50">
            <CardTitle className="text-lg">Complaint Details</CardTitle>
            <CardDescription>
              Be clear and concise to help our team resolve your issue faster.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ComplaintForm 
              onSubmit={handleSubmit} 
              onCancel={() => router.push('/dashboard')}
            />
          </CardContent>
        </Card>

        {/* Support Note */}
        <div className="rounded-2xl bg-white/40 p-6 backdrop-blur-sm border-2 border-dashed border-slate-200 text-center">
            <p className="text-sm text-slate-500 font-medium italic">
                "Our commitment is to resolve every institutional grievance within <span className="text-blue-600 font-bold">48 working hours</span>. 
                Thank you for helping us maintain high standards at JSPM's Jayawantrao Sawant Polytechnic."
            </p>
        </div>
      </div>
    </div>
  );
}
