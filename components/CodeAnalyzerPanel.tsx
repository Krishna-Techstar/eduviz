'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeCodeFromApi } from '@/lib/eduviz/client';
import { backendIdToFrontendId } from '@/lib/eduviz/algorithmIds';
import type { AlgorithmType } from '@/lib/algorithms/types';

interface CodeAnalyzerPanelProps {
  onApplyAlgorithm?: (branch: AlgorithmType, algorithmId: string) => void;
}

export default function CodeAnalyzerPanel({ onApplyAlgorithm }: CodeAnalyzerPanelProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'cpp' | 'java' | 'unknown'>('cpp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    algorithm: string;
    confidence: number;
  } | null>(null);

  const run = async () => {
    setError(null);
    setResult(null);
    if (!code.trim()) {
      setError('Paste some C++ or Java code first.');
      return;
    }
    setLoading(true);
    try {
      const data = (await analyzeCodeFromApi(code, language)) as {
        algorithm?: string;
        confidence?: number;
        error?: string;
      };
      if (data.error) {
        setError(data.error);
        return;
      }
      if (data.algorithm && data.confidence != null) {
        setResult({ algorithm: data.algorithm, confidence: data.confidence });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!result) return;
    const id = backendIdToFrontendId(result.algorithm);
    if (!id || !onApplyAlgorithm) return;
    onApplyAlgorithm('data-structures', id);
  };

  const canApply = result && backendIdToFrontendId(result.algorithm);

  return (
    <Card className="border-violet-100 bg-violet-50/30 p-3 md:p-4">
      <h2 className="mb-1 text-sm font-semibold text-slate-900">Code → algorithm</h2>
      <p className="mb-2 text-[11px] leading-snug text-slate-600 md:text-xs">
        Pattern-only analysis (not executed). Optional: needs backend for API.
      </p>

      <div className="flex gap-2 mb-2">
        <select
          className="text-xs border rounded px-2 py-1.5 bg-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <textarea
        className="min-h-[88px] w-full resize-y rounded-md border bg-white p-2 font-mono text-[11px] md:min-h-[100px] md:text-xs"
        placeholder={'#include <queue>\nvoid bfs() { std::queue<int> q; ... }'}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 mt-2">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-2 text-xs space-y-1">
          <p>
            <span className="font-medium text-slate-700">Detected:</span>{' '}
            <code className="bg-white px-1 rounded">{result.algorithm}</code>{' '}
            <span className="text-slate-500">
              (confidence {Math.round(result.confidence * 100)}%)
            </span>
          </p>
          {canApply ? (
            <Button size="sm" variant="secondary" className="mt-1" onClick={apply}>
              Select this algorithm in the list
            </Button>
          ) : (
            <p className="text-slate-500">
              No matching UI entry for this id — choose an algorithm manually.
            </p>
          )}
        </div>
      )}

      <Button
        className="mt-2 min-h-11 w-full touch-manipulation bg-violet-600 hover:bg-violet-700"
        size="sm"
        disabled={loading}
        onClick={() => void run()}
      >
        {loading ? 'Analyzing…' : 'Analyze code'}
      </Button>
    </Card>
  );
}
