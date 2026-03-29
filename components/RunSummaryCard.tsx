'use client';

import { Card } from '@/components/ui/card';
import type { VisualizeRunMeta } from '@/lib/eduviz/types';

export default function RunSummaryCard({ meta }: { meta: VisualizeRunMeta }) {
  return (
    <Card className="border-emerald-100 bg-emerald-50/50 p-2.5 md:p-3">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-800 md:text-sm">
        <span>
          <span className="font-medium text-slate-600">Algorithm:</span>{' '}
          <code className="text-xs bg-white px-1 rounded">{meta.algorithm}</code>
        </span>
        <span>
          <span className="font-medium text-slate-600">Steps:</span> {meta.totalSteps}
        </span>
        {meta.complexity && (
          <span className="text-xs">
            <span className="font-medium text-slate-600">Complexity:</span>{' '}
            {meta.complexity.time} time, {meta.complexity.space} space
          </span>
        )}
      </div>
    </Card>
  );
}
