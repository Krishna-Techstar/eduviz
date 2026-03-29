/**
 * Canvas renderer for computer graphics algorithms
 */

import { CGVisualizationState, CanvasCommand, Point } from '@/lib/algorithms/types';

export class CanvasGraphicsRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  /**
   * Render visualization state to canvas
   */
  public render(state: CGVisualizationState): void {
    this.clear();
    this.executeCommands(state.canvas);
    this.renderControlPoints(state.controlPoints);
    this.renderIntermediatePoints(state.intermediatePoints);
    this.renderHighlightedPoint(state.highlightedPoint);
  }

  /**
   * Execute canvas drawing commands
   */
  private executeCommands(commands: CanvasCommand[]): void {
    for (const command of commands) {
      switch (command.type) {
        case 'line':
          this.drawLine(command);
          break;
        case 'point':
          this.drawPoint(command);
          break;
        case 'circle':
          this.drawCircle(command);
          break;
        case 'polygon':
          this.drawPolygon(command);
          break;
        case 'pixel':
          this.drawPixel(command);
          break;
      }
    }
  }

  /**
   * Draw a line
   */
  private drawLine(command: CanvasCommand): void {
    const { x0, y0, x1, y1 } = command.properties;

    this.ctx.strokeStyle = command.color || '#3498DB';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }

  /**
   * Draw a point/circle
   */
  private drawPoint(command: CanvasCommand): void {
    const { x, y, radius } = command.properties;
    const r = radius || 3;

    this.ctx.fillStyle = command.color || '#3498DB';
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();

    // Add border
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  /**
   * Draw a circle
   */
  private drawCircle(command: CanvasCommand): void {
    const { x, y, radius } = command.properties;

    this.ctx.strokeStyle = command.color || '#3498DB';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  /**
   * Draw a polygon
   */
  private drawPolygon(command: CanvasCommand): void {
    const { points } = command.properties;

    if (!points || points.length < 2) return;

    this.ctx.fillStyle = command.color || 'rgba(52, 152, 219, 0.3)';
    this.ctx.strokeStyle = command.color || '#3498DB';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * Draw a pixel (for rasterization algorithms)
   */
  private drawPixel(command: CanvasCommand): void {
    const { x, y } = command.properties;
    const pixelSize = 2;

    this.ctx.fillStyle = command.color || '#3498DB';
    this.ctx.fillRect(x - pixelSize / 2, y - pixelSize / 2, pixelSize, pixelSize);
  }

  /**
   * Render control points
   */
  private renderControlPoints(points?: Point[]): void {
    if (!points) return;

    for (const point of points) {
      this.ctx.fillStyle = '#E74C3C';
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      this.ctx.fill();

      // Add label if available
      if (point.type) {
        this.ctx.fillStyle = '#000';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(point.type, point.x + 7, point.y - 5);
      }
    }
  }

  /**
   * Render intermediate points
   */
  private renderIntermediatePoints(points?: Point[]): void {
    if (!points) return;

    for (const point of points) {
      this.ctx.fillStyle = 'rgba(52, 152, 219, 0.6)';
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  /**
   * Render highlighted point
   */
  private renderHighlightedPoint(point?: Point): void {
    if (!point) return;

    this.ctx.fillStyle = '#27AE60';
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
    this.ctx.fill();

    // Add glow effect
    this.ctx.strokeStyle = 'rgba(39, 174, 96, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  /**
   * Clear canvas
   */
  private clear(): void {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw grid
    this.drawGrid();
  }

  /**
   * Draw background grid
   */
  private drawGrid(): void {
    const gridSize = 20;
    this.ctx.strokeStyle = '#f0f0f0';
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x <= this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  /**
   * Get canvas dimensions
   */
  public getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}
