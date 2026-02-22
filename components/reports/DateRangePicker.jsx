'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, onApply }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <Label className="text-xs text-slate-500 mb-1 block">From</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-40 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-slate-500 mb-1 block">To</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-40 text-sm"
        />
      </div>
      <Button variant="outline" size="sm" onClick={onApply} className="flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        Apply
      </Button>
    </div>
  );
}
