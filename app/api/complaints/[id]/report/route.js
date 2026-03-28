import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { generateSingleComplaintPDF } from '@/lib/pdf';

// GET /api/complaints/[id]/report - Generate and download PDF report
export async function GET(request, { params: _params }) {
  try {
    const params = await _params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Complaint ID is required' }, { status: 400 });
    }

    await connectDB();
    
    // Fetch complaint with all relevant data for the report
    const complaint = await Complaint.findById(id)
      .populate('userId', 'name email department')
      .populate('assignedTo', 'name email department')
      .populate({
        path: 'remarks',
        populate: {
          path: 'userId',
          select: 'name role'
        }
      });

    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    // Generate the PDF buffer
    const pdfArrayBuffer = await generateSingleComplaintPDF(complaint);
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Set headers for file download
    const response = new NextResponse(pdfBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `attachment; filename=Complaint-Report-${complaint.ticketId}.pdf`);

    return response;
  } catch (error) {
    console.error('[Report] Download error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to generate PDF report' },
        { status: 500 }
    );
  }
}
