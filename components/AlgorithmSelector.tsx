'use client';

import { useState } from 'react';
import { AlgorithmType } from '@/lib/algorithms/types';
import {
  SORTING_ALGORITHMS,
  GRAPH_ALGORITHMS,
  GRAPHICS_ALGORITHMS,
} from '@/lib/algorithms/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AlgorithmSelectorProps {
  selectedBranch: AlgorithmType | null;
  selectedAlgorithm: string | null;
  onSelect: (branch: AlgorithmType, algorithmId: string) => void;
}

export default function AlgorithmSelector({
  selectedBranch,
  selectedAlgorithm,
  onSelect,
}: AlgorithmSelectorProps) {
  const [expandedBranch, setExpandedBranch] = useState<AlgorithmType | null>(null);

  const handleBranchClick = (branch: AlgorithmType) => {
    setExpandedBranch(expandedBranch === branch ? null : branch);
  };

  return (
    <Card className="p-3 md:p-4">
      <h2 className="mb-2 text-base font-semibold text-slate-900 md:mb-3 md:text-lg">
        Algorithms
      </h2>

      {/* Branch 1: Data Structures */}
      <div className="mb-3 md:mb-4">
        <button
          type="button"
          onClick={() => handleBranchClick('data-structures')}
          className={`mb-2 w-full min-h-11 touch-manipulation rounded-lg p-2.5 text-left text-sm transition-colors md:p-3 md:text-base ${
            expandedBranch === 'data-structures'
              ? 'bg-blue-100 text-blue-900'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
          }`}
        >
          <div className="font-semibold flex items-center justify-between">
            Data Structures & Algorithms
            <span className="text-sm">
              {expandedBranch === 'data-structures' ? '▼' : '▶'}
            </span>
          </div>
        </button>

        {expandedBranch === 'data-structures' && (
          <div className="space-y-2 pl-2 mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-600 uppercase mb-2">
                Sorting
              </h3>
              {SORTING_ALGORITHMS.map((algo) => (
                <Button
                  key={algo.id}
                  variant={selectedAlgorithm === algo.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelect('data-structures', algo.id)}
                  className="mb-1 min-h-10 w-full touch-manipulation justify-start text-left text-xs md:text-sm"
                >
                  {algo.name}
                </Button>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-600 uppercase mb-2 mt-3">
                Graph Algorithms
              </h3>
              {GRAPH_ALGORITHMS.map((algo) => (
                <Button
                  key={algo.id}
                  variant={selectedAlgorithm === algo.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelect('data-structures', algo.id)}
                  className="mb-1 min-h-10 w-full touch-manipulation justify-start text-left text-xs md:text-sm"
                >
                  {algo.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Branch 2: Computer Graphics */}
      <div>
        <button
          type="button"
          onClick={() => handleBranchClick('computer-graphics')}
          className={`mb-2 w-full min-h-11 touch-manipulation rounded-lg p-2.5 text-left text-sm transition-colors md:p-3 md:text-base ${
            expandedBranch === 'computer-graphics'
              ? 'bg-purple-100 text-purple-900'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
          }`}
        >
          <div className="font-semibold flex items-center justify-between">
            Computer Graphics
            <span className="text-sm">
              {expandedBranch === 'computer-graphics' ? '▼' : '▶'}
            </span>
          </div>
        </button>

        {expandedBranch === 'computer-graphics' && (
          <div className="space-y-2 pl-2">
            <div>
              <h3 className="text-xs font-semibold text-slate-600 uppercase mb-2">
                Graphics Algorithms
              </h3>
              {GRAPHICS_ALGORITHMS.map((algo) => (
                <Button
                  key={algo.id}
                  variant={selectedAlgorithm === algo.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelect('computer-graphics', algo.id)}
                  className="mb-1 min-h-10 w-full touch-manipulation justify-start text-left text-xs md:text-sm"
                >
                  {algo.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
