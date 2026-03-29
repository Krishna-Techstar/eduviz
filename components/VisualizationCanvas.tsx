'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Algorithm, DSAlgorithmStep, CGAlgorithmStep } from '@/lib/algorithms/types';
import {
  renderArrayVisualization,
  renderGraphVisualization,
  renderTreeVisualization,
} from '@/lib/visualization/d3Renderer';
import { CanvasGraphicsRenderer } from '@/lib/visualization/canvasRenderer';

interface VisualizationCanvasProps {
  step: Algorithm;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepChange: (index: number) => void;
}

export default function VisualizationCanvas({
  step,
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onStepChange,
}: VisualizationCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutSize, setLayoutSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.max(0, Math.floor(r.width));
    const h = Math.max(0, Math.floor(r.height));
    setLayoutSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      measure();
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!isPlaying || speed <= 0) return;
    if (currentStepIndex >= totalSteps - 1) return;

    const delay = Math.max(100, 2000 / speed);
    const timer = setTimeout(() => {
      onStepChange(currentStepIndex + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, speed, onStepChange]);

  useEffect(() => {
    if (step.branch === 'computer-graphics') {
      const cgStep = step as CGAlgorithmStep;
      if (canvasRef.current) {
        try {
          const canvas = canvasRef.current;
          canvas.width = 600;
          canvas.height = 400;
          const renderer = new CanvasGraphicsRenderer(canvas);
          renderer.render(cgStep.state);
        } catch (err) {
          console.error('Error rendering canvas:', err);
        }
      }
      return;
    }

    const w = layoutSize.w;
    const h = layoutSize.h;
    if (w < 32 || h < 32) return;

    if (step.branch === 'data-structures') {
      const dsStep = step as DSAlgorithmStep;

      if (svgRef.current) {
        if (dsStep.state.arrays) {
          renderArrayVisualization(
            svgRef.current,
            dsStep.state,
            dsStep.engineSnapshot?.stepType,
          );
        } else if (dsStep.state.graph) {
          const g = dsStep.state.graph;
          renderGraphVisualization(
            svgRef.current,
            g.nodes,
            g.edges,
            g.highlightedEdges,
            {
              queue: g.queue,
              stack: g.stack,
              fringeMode: g.fringeMode,
            },
          );
        } else if (dsStep.state.tree) {
          renderTreeVisualization(svgRef.current, dsStep.state.tree.root);
        }
      }
    }
  }, [step, layoutSize]);

  const isGraphicsAlgorithm = step.branch === 'computer-graphics';

  return (
    <div
      ref={containerRef}
      className="flex h-full min-h-[240px] w-full min-w-0 flex-1 flex-col touch-manipulation"
    >
      {!isGraphicsAlgorithm ? (
        <svg
          ref={svgRef}
          className="block h-full w-full min-h-[240px] bg-white"
          role="img"
          aria-label="Algorithm visualization"
        />
      ) : (
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="mx-auto block h-auto w-full max-h-[min(70vh,520px)] bg-white object-contain"
          role="img"
          aria-label="Graphics visualization"
        />
      )}
    </div>
  );
}
