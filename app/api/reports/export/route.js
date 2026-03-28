import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Complaint from '@/models/Complaint';
import { generateComplaintsPDF } from '@/lib/pdf';
import { generateComplaintsExcel } from '@/lib/excel';

export async function GET(request) {
  const session = await getSession();

  // Role-based access control
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    await connectDB();

    // Query filters
    const query = {};
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Fetch complaints with populated user info
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    if (format === 'excel') {
      const buffer = await generateComplaintsExcel(complaints);
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Complaint_Report_${Date.now()}.xlsx"`
        }
      });
    } else {
      const buffer = await generateComplaintsPDF(complaints, {
        title: "Departmental Grievance Report",
        subtitle: `Date Range: ${dateFrom || 'All Time'} to ${dateTo || 'Present'}`
      });
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Complaint_Report_${Date.now()}.pdf"`
        }
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ success: false, message: 'Generation failed', error: error.message }, { status: 500 });
  }
}
