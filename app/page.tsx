'use client';

import { useState } from 'react';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import InputPanel from '@/components/InputPanel';
import VisualizationCanvas from '@/components/VisualizationCanvas';
import ControlPanel from '@/components/ControlPanel';
import ExplanationPanel from '@/components/ExplanationPanel';
import EngineStatePanel from '@/components/EngineStatePanel';
import CodeAnalyzerPanel from '@/components/CodeAnalyzerPanel';
import RunSummaryCard from '@/components/RunSummaryCard';
import { Algorithm, AlgorithmType } from '@/lib/algorithms/types';
import type { VisualizeRunMeta } from '@/lib/eduviz/types';

export default function Home() {
  const [selectedBranch, setSelectedBranch] = useState<AlgorithmType | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [steps, setSteps] = useState<Algorithm[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [runMeta, setRunMeta] = useState<VisualizeRunMeta | null>(null);

  const currentStep = steps[currentStepIndex];

  const handleAlgorithmSelect = (branch: AlgorithmType, algorithmId: string) => {
    setSelectedBranch(branch);
    setSelectedAlgorithm(algorithmId);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setRunMeta(null);
  };

  const handleInputSubmit = (nextSteps: Algorithm[], meta?: VisualizeRunMeta) => {
    setSteps(nextSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setRunMeta(meta ?? null);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <main className="eduviz-shell flex w-full flex-col overflow-x-hidden bg-gradient-to-br from-slate-50 to-slate-100 pt-safe pb-4">
      {/* Header: single row on 1080p; compact on mobile */}
      <header className="shrink-0 border-b border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm md:px-4 md:py-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            EduViz
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block md:text-sm">
            Local visualizations · comma-separated numbers for sorts
          </p>
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-600 sm:hidden">
          Select an algorithm, enter data, Visualize.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-2 pb-safe md:gap-4 md:p-4 lg:flex-row lg:items-start">
        {/* Left: algorithm + input */}
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:sticky lg:top-2 lg:w-[min(100%,400px)] lg:max-w-[420px]">
          <AlgorithmSelector
            selectedBranch={selectedBranch}
            selectedAlgorithm={selectedAlgorithm}
            onSelect={handleAlgorithmSelect}
          />

          <CodeAnalyzerPanel
            onApplyAlgorithm={(branch, algorithmId) => {
              setSelectedBranch(branch);
              setSelectedAlgorithm(algorithmId);
              setSteps([]);
              setCurrentStepIndex(0);
              setIsPlaying(false);
              setRunMeta(null);
            }}
          />

          {selectedAlgorithm && selectedBranch && (
            <InputPanel
              branch={selectedBranch}
              algorithmId={selectedAlgorithm}
              onSubmit={handleInputSubmit}
            />
          )}
        </aside>

        {/* Right: visualization + controls — fills remaining 1080p height */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          <div className="relative flex min-h-[320px] w-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-md sm:min-h-[min(45vh,520px)] lg:min-h-[min(52vh,620px)]">
            {steps.length > 0 && currentStep ? (
              <VisualizationCanvas
                step={currentStep}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
                isPlaying={isPlaying}
                speed={speed}
                onStepChange={(index) => setCurrentStepIndex(index)}
              />
            ) : (
              <div className="flex h-full min-h-[200px] w-full flex-1 items-center justify-center px-4">
                <p className="text-center text-sm text-slate-400 md:text-base">
                  {!selectedAlgorithm
                    ? 'Select an algorithm to begin'
                    : 'Enter input and tap Visualize'}
                </p>
              </div>
            )}
          </div>

          {steps.length > 0 && currentStep && (
            <div className="flex shrink-0 flex-col gap-3">
              {runMeta && <RunSummaryCard meta={runMeta} />}

              <ControlPanel
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                isPlaying={isPlaying}
                speed={speed}
                onPlayPause={handlePlayPause}
                onNextStep={handleNextStep}
                onPreviousStep={handlePreviousStep}
                onSpeedChange={handleSpeedChange}
              />

              <div className="grid min-h-0 gap-2 lg:grid-cols-2">
                <EngineStatePanel step={currentStep} />
                <ExplanationPanel step={currentStep} />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
