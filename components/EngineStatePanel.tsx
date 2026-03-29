'use client';

import { Card } from '@/components/ui/card';
import type { DSAlgorithmStep, Algorithm } from '@/lib/algorithms/types';

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-xs font-mono text-slate-800">
      {children}
    </span>
  );
}

interface EngineStatePanelProps {
  step: Algorithm;
}

export default function EngineStatePanel({ step }: EngineStatePanelProps) {
  if (step.branch !== 'data-structures') return null;
  const ds = step as DSAlgorithmStep;
  const snap = ds.engineSnapshot;
  if (!snap) {
    return (
      <Card className="border-dashed border-slate-200 bg-slate-50/80 p-3 md:p-4">
        <p className="text-xs text-slate-500 md:text-sm">
          Extra fields (queue, stack, distances) appear when steps include an engine
          snapshot (e.g. from the optional API). Local runs still show the canvas and
          explanation above.
        </p>
      </Card>
    );
  }

  const distEntries = Object.entries(snap.distances).filter(
    ([, v]) => v !== null && v !== undefined,
  ) as [string, number][];

  const isGraph = ds.dataStructure === 'graph';

  return (
    <Card className="max-h-40 overflow-y-auto border-indigo-100 bg-indigo-50/40 p-3 md:max-h-48 md:p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Engine state</h3>
        <Chip>type: {snap.stepType}</Chip>
        {snap.current != null && snap.current !== '' && (
          <Chip>current: {String(snap.current)}</Chip>
        )}
      </div>

      <div className="grid gap-3 text-sm text-slate-700">
        {isGraph && (
          <>
            <div>
              <span className="font-medium text-slate-600">Queue (front → back):</span>{' '}
              <span className="font-mono text-xs">
                {snap.queue.length ? snap.queue.join(' → ') : '∅'}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-600">Stack (top → bottom):</span>{' '}
              <span className="font-mono text-xs">
                {snap.stack.length ? snap.stack.join(' | ') : '∅'}
              </span>
            </div>
          </>
        )}

        {snap.visited.length > 0 && isGraph && (
          <div>
            <span className="font-medium text-slate-600">Visited:</span>{' '}
            <span className="font-mono text-xs">{snap.visited.join(', ')}</span>
          </div>
        )}

        {distEntries.length > 0 && (
          <div>
            <span className="font-medium text-slate-600">Distances:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {distEntries.map(([k, v]) => (
                <Chip key={k}>
                  {k}: {v}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {snap.array.length > 0 && ds.dataStructure === 'array' && (
          <div>
            <span className="font-medium text-slate-600">Array:</span>{' '}
            <span className="font-mono text-xs">[{snap.array.join(', ')}]</span>
            {snap.comparing && (
              <span className="ml-2 text-xs text-rose-600">
                comparing indices {snap.comparing[0]}, {snap.comparing[1]}
              </span>
            )}
          </div>
        )}

        {snap.highlightEdges.length > 0 && isGraph && (
          <div>
            <span className="font-medium text-slate-600">Highlighted edges:</span>{' '}
            <span className="font-mono text-xs">
              {snap.highlightEdges.map(([a, b]) => `${a}–${b}`).join(', ')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
