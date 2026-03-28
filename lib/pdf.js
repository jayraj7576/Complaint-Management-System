import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF report for complaints.
 * @param {Array} complaints - List of complaint objects.
 * @param {Object} options - { title, subtitle }
 */
export async function generateComplaintsPDF(complaints, { title = "Complaints Report", subtitle = "" } = {}) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(subtitle || `Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Data Table
  const tableData = complaints.map((c, index) => [
    index + 1,
    c.ticketId,
    c.title,
    c.category,
    c.status,
    c.priority,
    new Date(c.createdAt).toLocaleDateString()
  ]);

  doc.autoTable({
    startY: 40,
    head: [['#', 'Ticket ID', 'Title', 'Category', 'Status', 'Priority', 'Created']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillStyle: [59, 130, 246] }, // blue-500
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      4: { fontStyle: 'bold' }
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount} - JSPM CMS`, 14, doc.internal.pageSize.height - 10);
  }

  return doc.output('arraybuffer');
}

/**
 * Generates a detailed PDF report for a single complaint.
 * @param {Object} complaint - The full complaint object with populated user/assignedTo.
 */
export async function generateSingleComplaintPDF(complaint) {
  const doc = new jsPDF();
  
  // Header & Title
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("Complaint Detailed Report", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Ticket ID: ${complaint.ticketId}`, 14, 28);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 34);

  // Horizontal Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 40, 196, 40);

  // Section 1: Basic Info
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text("1. Basic Information", 14, 50);

  const basicData = [
    ["Title", complaint.title],
    ["Category", complaint.category],
    ["Priority", complaint.priority],
    ["Status", complaint.status],
    ["Created At", new Date(complaint.createdAt).toLocaleString()],
    ["Last Updated", new Date(complaint.updatedAt).toLocaleString()]
  ];

  doc.autoTable({
    startY: 55,
    body: basicData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
  });

  // Section 2: User & Department
  let currentY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("2. Submission Details", 14, currentY);

  const submissionData = [
    ["Submitted By", complaint.userId?.name || "N/A"],
    ["User Email", complaint.userId?.email || "N/A"],
    ["Department", complaint.department || "N/A"],
    ["Assigned To", complaint.assignedTo?.name || "Unassigned"]
  ];

  doc.autoTable({
    startY: currentY + 5,
    body: submissionData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
  });

  // Section 3: Description (Wrapped)
  currentY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("3. Description", 14, currentY);
  
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const splitDescription = doc.splitTextToSize(complaint.description, 180);
  doc.text(splitDescription, 14, currentY + 8);
  
  currentY += 12 + (splitDescription.length * 5);

  // Section 4: Remarks
  if (complaint.remarks?.length > 0) {
    if (currentY > 250) { doc.addPage(); currentY = 20; }
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text("4. Remarks & Updates", 14, currentY);
    
    const remarksData = complaint.remarks.map(r => [
      new Date(r.createdAt).toLocaleString(),
      r.userId?.name || "System",
      r.content
    ]);

    doc.autoTable({
      startY: currentY + 5,
      head: [['Date', 'User', 'Content']],
      body: remarksData,
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105] },
      styles: { fontSize: 9 },
      columnStyles: { 2: { cellWidth: 100 } }
    });
    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Ticket: ${complaint.ticketId} - Page ${i} of ${pageCount} - JSPM CMS Internal Report`, 14, doc.internal.pageSize.height - 10);
  }

  return doc.output('arraybuffer');
}
