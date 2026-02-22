'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ReportCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    red:    'bg-red-50 text-red-700 border-red-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <Card className={cn('border', colorMap[color])}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs mt-1 opacity-60">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="p-2 rounded-lg bg-white/60">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
