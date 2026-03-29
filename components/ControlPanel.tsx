'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlPanelProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function ControlPanel({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onNextStep,
  onPreviousStep,
  onSpeedChange,
}: ControlPanelProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="p-3 md:p-4">
      <div className="space-y-3 md:space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-700 md:text-sm">Progress</span>
            <span className="text-xs text-slate-600 md:text-sm">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="default"
            variant="outline"
            className="min-h-11 min-w-11 touch-manipulation px-3"
            onClick={onPreviousStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            size="default"
            className="min-h-11 min-w-[7rem] touch-manipulation bg-blue-600 hover:bg-blue-700"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-1.5 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-4 w-4" />
                Play
              </>
            )}
          </Button>

          <Button
            size="default"
            variant="outline"
            className="min-h-11 min-w-11 touch-manipulation px-3"
            onClick={onNextStep}
            disabled={currentStep === totalSteps - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700 md:text-sm">
            Speed: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="h-3 w-full cursor-pointer touch-manipulation rounded-lg bg-slate-200 accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-500 md:text-xs">
            <span>0.5x</span>
            <span>1.5x</span>
            <span>3x</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
