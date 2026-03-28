'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Table, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportButtons({ startDate, endDate }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const handleExport = async (format) => {
    const setLoader = format === 'pdf' ? setPdfLoading : setExcelLoading;
    setLoader(true);
    
    try {
      const params = new URLSearchParams({ format });
      if (startDate) params.set('dateFrom', startDate);
      if (endDate)   params.set('dateTo', endDate);
      
      const res = await fetch(`/api/reports/export?${params.toString()}`);
      if (!res.ok) throw new Error(`${format.toUpperCase()} generation failed`);
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CMS_Report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} report generated successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to generate ${format.toUpperCase()} report`);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline" 
        onClick={() => handleExport('pdf')} 
        disabled={pdfLoading}
        className="rounded-xl border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-semibold"
      >
        {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileDown className="h-4 w-4 mr-2" />}
        PDF Report
      </Button>
      <Button 
        variant="default"
        onClick={() => handleExport('excel')} 
        disabled={excelLoading}
        className="rounded-xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 font-semibold"
      >
        {excelLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Table className="h-4 w-4 mr-2" />}
        Excel Spreadsheet
      </Button>
    </div>
  );
}
