'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Table2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportButtons({ startDate, endDate }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate)   params.set('endDate', endDate);
    return params.toString();
  };

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/reports/export/pdf?${buildQuery()}`);
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExcel = async () => {
    setExcelLoading(true);
    try {
      const res = await fetch(`/api/reports/export/excel?${buildQuery()}`);
      if (!res.ok) throw new Error('Excel generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Excel downloaded successfully');
    } catch (err) {
      toast.error('Failed to generate Excel');
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handlePDF} disabled={pdfLoading}>
        {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <FileText className="h-4 w-4 mr-1" />}
        Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleExcel} disabled={excelLoading}>
        {excelLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Table2 className="h-4 w-4 mr-1" />}
        Export Excel
      </Button>
    </div>
  );
}
