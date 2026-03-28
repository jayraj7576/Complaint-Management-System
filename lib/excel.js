import * as XLSX from 'xlsx';

/**
 * Generates an Excel spreadsheet from a list of complaints.
 * @param {Array} complaints - List of complaint objects.
 * @param {Object} options - { title, subtitle }
 */
export async function generateComplaintsExcel(complaints) {
  // Format data for sheet
  const wsData = complaints.map((c, index) => ({
    '#': index + 1,
    'Ticket ID': c.ticketId,
    'Title': c.title,
    'Category': c.category,
    'Status': c.status,
    'Priority': c.priority,
    'Department': c.department || 'N/A',
    'Created At': new Date(c.createdAt).toLocaleString(),
    'Updated At': new Date(c.updatedAt).toLocaleString(),
    'Description': c.description
  }));

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Complaints Report");

  // Style column widths
  ws['!cols'] = [
    { wch: 5 },  // #
    { wch: 20 }, // ticketId
    { wch: 30 }, // title
    { wch: 15 }, // category
    { wch: 12 }, // status
    { wch: 10 }, // priority
    { wch: 20 }, // department
    { wch: 25 }, // createdAt
    { wch: 25 }, // updatedAt
    { wch: 50 }, // description
  ];

  // Write for downstream streaming
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
