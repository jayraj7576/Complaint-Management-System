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
