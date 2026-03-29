'use client';

import { useState } from 'react';
import { AlgorithmType, Algorithm, Point } from '@/lib/algorithms/types';
import {
  SAMPLE_ARRAYS,
  SAMPLE_GRAPHS,
  SAMPLE_CANVAS,
} from '@/lib/algorithms/constants';
import {
  generateBubbleSortSteps,
  generateMergeSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateQuickSortSteps,
  generateBFSSteps,
  generateDFSSteps,
  generateDijkstraSteps,
  generateKruskalSteps,
  generatePrimSteps,
  generateBinaryTreeTraversalSteps,
  treeFromSampleBinary,
} from '@/lib/algorithms/dataStructures';
import {
  generateBresenhamLineSteps,
  generateDDALineSteps,
  generateBezierCurveSteps,
  generateBSplineSteps,
  generateScanLineFillSteps,
} from '@/lib/algorithms/computerGraphics';
import { ALGORITHM_INPUT_HELP } from '@/lib/algorithms/inputHelp';
import type { VisualizeRunMeta } from '@/lib/eduviz/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputPanelProps {
  branch: AlgorithmType;
  algorithmId: string;
  onSubmit: (steps: Algorithm[], meta?: VisualizeRunMeta) => void;
}

function parseArrayInput(input: string): number[] {
  if (!input.trim()) return [];
  return input
    .split(',')
    .map((s) => {
      const num = parseFloat(s.trim());
      return isNaN(num) ? null : num;
    })
    .filter((n) => n !== null) as number[];
}

/** Parses "x0,y0,x1,y1" or whitespace-separated four numbers. */
function parseLineEndpoints(s: string): { start: Point; end: Point } | null {
  const parts = s
    .trim()
    .split(/[,;\s]+/)
    .filter(Boolean)
    .map((x) => parseFloat(x));
  if (parts.length >= 4 && parts.every((n) => !Number.isNaN(n))) {
    return {
      start: { x: parts[0], y: parts[1] },
      end: { x: parts[2], y: parts[3] },
    };
  }
  return null;
}

export default function InputPanel({
  branch,
  algorithmId,
  onSubmit,
}: InputPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [graphicsExtra, setGraphicsExtra] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [graphStart, setGraphStart] = useState('A');
  const [treeOrder, setTreeOrder] = useState<
    'inorder' | 'preorder' | 'postorder'
  >('inorder');

  const help =
    ALGORITHM_INPUT_HELP[algorithmId] ??
    'Configure options below, then click Visualize.';

  const handleVisualize = () => {
    setError('');
    setLoading(true);

    try {
      let steps: Algorithm[] = [];

      if (branch === 'data-structures') {
        if (
          algorithmId.includes('sort') ||
          algorithmId.includes('search')
        ) {
          const array = parseArrayInput(inputValue);
          if (array.length === 0) {
            setError('Enter comma-separated numbers, e.g. 5, 2, 8, 1');
            return;
          }
          switch (algorithmId) {
            case 'bubble-sort':
              steps = generateBubbleSortSteps(array);
              break;
            case 'merge-sort':
              steps = generateMergeSortSteps(array);
              break;
            case 'selection-sort':
              steps = generateSelectionSortSteps(array);
              break;
            case 'insertion-sort':
              steps = generateInsertionSortSteps(array);
              break;
            case 'quick-sort':
              steps = generateQuickSortSteps(array);
              break;
            default:
              setError('This sort is not wired yet.');
              return;
          }
        } else if (
          algorithmId === 'bfs' ||
          algorithmId === 'dfs' ||
          algorithmId === 'dijkstra'
        ) {
          const g = SAMPLE_GRAPHS.simple;
          const start = graphStart.trim() || String(g.nodes[0].id);
          if (algorithmId === 'bfs') {
            steps = generateBFSSteps(g.nodes, g.edges, start);
          } else if (algorithmId === 'dfs') {
            steps = generateDFSSteps(g.nodes, g.edges, start);
          } else {
            steps = generateDijkstraSteps(g.nodes, g.edges, start);
          }
        } else if (algorithmId === 'kruskal') {
          const g = SAMPLE_GRAPHS.weighted;
          steps = generateKruskalSteps(g.nodes, g.edges);
        } else if (algorithmId === 'prim') {
          const g = SAMPLE_GRAPHS.weighted;
          const start = graphStart.trim() || String(g.nodes[0].id);
          steps = generatePrimSteps(g.nodes, g.edges, start);
        } else if (algorithmId === 'binary-tree') {
          const root = treeFromSampleBinary();
          steps = generateBinaryTreeTraversalSteps(root, treeOrder);
        } else {
          setError('Algorithm not implemented.');
          return;
        }
      } else if (branch === 'computer-graphics') {
        const line = parseLineEndpoints(graphicsExtra);
        const start = line?.start ?? { x: 50, y: 50 };
        const end = line?.end ?? { x: 300, y: 250 };

        switch (algorithmId) {
          case 'bresenham-line':
            steps = generateBresenhamLineSteps(start, end);
            break;
          case 'dda-line':
            steps = generateDDALineSteps(start, end);
            break;
          case 'bezier-curve':
            steps = generateBezierCurveSteps(SAMPLE_CANVAS.bezierControlPoints);
            break;
          case 'bspline':
            steps = generateBSplineSteps(SAMPLE_CANVAS.bezierPoints);
            break;
          case 'scan-line-fill':
            steps = generateScanLineFillSteps(SAMPLE_CANVAS.polygon);
            break;
          default:
            setError('Graphics algorithm not implemented.');
            return;
        }
      }

      if (steps.length > 0) {
        onSubmit(steps, undefined);
      } else {
        setError('No steps generated.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = (sampleName: string) => {
    if (sampleName === 'small') {
      setInputValue(SAMPLE_ARRAYS.small.join(', '));
    } else if (sampleName === 'medium') {
      setInputValue(SAMPLE_ARRAYS.medium.join(', '));
    } else if (sampleName === 'reverse') {
      setInputValue(SAMPLE_ARRAYS.reverse.join(', '));
    }
  };

  const isSortingAlgorithm =
    branch === 'data-structures' &&
    (algorithmId.includes('sort') || algorithmId.includes('search'));
  const isGraphAlgorithm =
    branch === 'data-structures' &&
    (algorithmId.includes('bfs') ||
      algorithmId.includes('dfs') ||
      algorithmId === 'dijkstra' ||
      algorithmId === 'kruskal' ||
      algorithmId === 'prim');
  const needsGraphStart =
    algorithmId === 'bfs' ||
    algorithmId === 'dfs' ||
    algorithmId === 'dijkstra' ||
    algorithmId === 'prim';
  const isBinaryTree = algorithmId === 'binary-tree';
  const isGraphicsAlgorithm = branch === 'computer-graphics';
  const graphicsUsesLine =
    algorithmId === 'bresenham-line' ||
    algorithmId === 'dda-line' ||
    algorithmId === 'bspline';

  return (
    <Card className="p-3 md:p-4">
      <h3 className="mb-1.5 text-base font-semibold text-slate-900 md:text-lg">
        Input
      </h3>
      <p className="mb-3 border-l-2 border-blue-200 pl-2 text-[11px] leading-relaxed text-slate-600 md:text-xs">
        {help}
      </p>

      {isSortingAlgorithm && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Array (comma-separated numbers)
            </label>
            <Input
              type="text"
              placeholder="e.g., 5, 2, 8, 1, 9"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadSampleData('small')}
            >
              Small
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadSampleData('medium')}
            >
              Medium
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadSampleData('reverse')}
            >
              Reverse
            </Button>
          </div>
        </div>
      )}

      {isGraphAlgorithm && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {algorithmId === 'kruskal' || algorithmId === 'prim'
              ? 'Uses the built-in weighted graph (sample: nodes A–F).'
              : 'Uses the built-in simple graph (nodes A–E).'}
          </p>
          {needsGraphStart && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start / source node id
              </label>
              <Input
                type="text"
                value={graphStart}
                onChange={(e) => setGraphStart(e.target.value)}
                placeholder="e.g. A"
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {isBinaryTree && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Traversal order
          </label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
            value={treeOrder}
            onChange={(e) =>
              setTreeOrder(e.target.value as typeof treeOrder)
            }
          >
            <option value="inorder">Inorder</option>
            <option value="preorder">Preorder</option>
            <option value="postorder">Postorder</option>
          </select>
        </div>
      )}

      {isGraphicsAlgorithm && (
        <div className="space-y-3">
          {graphicsUsesLine && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Line (optional): x0, y0, x1, y1
              </label>
              <Input
                type="text"
                placeholder="50, 50, 300, 250"
                value={graphicsExtra}
                onChange={(e) => setGraphicsExtra(e.target.value)}
                className="w-full font-mono text-sm"
              />
            </div>
          )}
          {!graphicsUsesLine && (
            <p className="text-sm text-slate-600">
              Uses built-in demo geometry from the app constants.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={() => void handleVisualize()}
        disabled={loading}
        className="mt-3 min-h-11 w-full touch-manipulation bg-blue-600 hover:bg-blue-700"
      >
        {loading ? 'Running…' : 'Visualize'}
      </Button>
    </Card>
  );
}
