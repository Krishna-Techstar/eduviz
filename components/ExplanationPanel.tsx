'use client';

import { Algorithm, DSAlgorithmStep, CGAlgorithmStep } from '@/lib/algorithms/types';
import { Card } from '@/components/ui/card';

interface ExplanationPanelProps {
  step: Algorithm;
}

export default function ExplanationPanel({ step }: ExplanationPanelProps) {
  const dsStep = step as DSAlgorithmStep;
  const cgStep = step as CGAlgorithmStep;

  return (
    <Card className="max-h-40 overflow-y-auto p-3 md:max-h-48 md:p-4">
      <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-900 md:text-base">
        Step {step.stepNumber + 1}: {step.description}
      </h3>

      {/* Pseudo Code */}
      {step.pseudoCode && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Pseudo Code
          </h4>
          <pre className="bg-slate-100 p-3 rounded-lg text-xs text-slate-800 overflow-x-auto font-mono">
            {step.pseudoCode}
          </pre>
        </div>
      )}

      {/* Complexity Information */}
      {step.complexity && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          {step.complexity.time && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700">
                Time Complexity
              </h4>
              <p className="text-sm text-slate-600 font-mono">
                {step.complexity.time}
              </p>
            </div>
          )}
          {step.complexity.space && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700">
                Space Complexity
              </h4>
              <p className="text-sm text-slate-600 font-mono">
                {step.complexity.space}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Data Structure State Details */}
      {step.branch === 'data-structures' && dsStep.state && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Current State
          </h4>

          {/* Array State */}
          {dsStep.state.arrays && dsStep.state.arrays.length > 0 && (
            <div className="text-xs text-slate-600 mb-2">
              <span className="font-mono">
                Array: [{dsStep.state.arrays[0].values.join(', ')}]
              </span>
            </div>
          )}

          {/* Graph State */}
          {dsStep.state.graph && (
            <div className="text-xs text-slate-600 mb-2">
              <span className="font-mono">
                Nodes: {dsStep.state.graph.nodes.length} | Edges:{' '}
                {dsStep.state.graph.edges.length}
              </span>
            </div>
          )}

          {/* Highlighted Elements */}
          {dsStep.state.highlightedIndices &&
            dsStep.state.highlightedIndices.length > 0 && (
              <div className="text-xs text-slate-600">
                <span className="font-semibold">Highlighted indices:</span>{' '}
                <span className="font-mono">
                  {dsStep.state.highlightedIndices.join(', ')}
                </span>
              </div>
            )}

          {dsStep.state.highlightedNodes &&
            dsStep.state.highlightedNodes.length > 0 && (
              <div className="text-xs text-slate-600">
                <span className="font-semibold">Highlighted nodes:</span>{' '}
                <span className="font-mono">
                  {dsStep.state.highlightedNodes.join(', ')}
                </span>
              </div>
            )}
        </div>
      )}

      {/* Computer Graphics State Details */}
      {step.branch === 'computer-graphics' && cgStep.state && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Rendering Information
          </h4>

          {cgStep.state.intermediatePoints && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold">Points plotted:</span>{' '}
              <span className="font-mono">
                {cgStep.state.intermediatePoints.length}
              </span>
            </div>
          )}

          {cgStep.state.canvas && (
            <div className="text-xs text-slate-600 mt-2">
              <span className="font-semibold">Canvas commands:</span>{' '}
              <span className="font-mono">{cgStep.state.canvas.length}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
