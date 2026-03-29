/**
 * D3.js rendering helpers for array and graph visualization
 */

import * as d3 from 'd3';
import { DSVisualizationState, ArrayState, GraphNode, GraphEdge, TreeNode } from '@/lib/algorithms/types';

// ============================================================================
// ARRAY VISUALIZATION (for sorting and searching)
// ============================================================================

export function renderArrayVisualization(
  svgElement: SVGSVGElement | null,
  state: DSVisualizationState,
  stepTypeCaption?: string,
): void {
  if (!svgElement || !state.arrays) return;

  const svg = d3.select(svgElement);
  const width = Math.max(svgElement.clientWidth || 0, 280);
  const height = Math.max(svgElement.clientHeight || 0, 220);

  const arrayState = state.arrays[0];
  const values = arrayState.values;
  const n = values.length;

  const padding = { top: 44, right: 24, bottom: 36, left: 24 };
  const barWidth = Math.max((width - padding.left - padding.right) / Math.max(n, 1), 4);
  const barPadding = barWidth * 0.1;
  const actualBarWidth = Math.max(barWidth - barPadding, 2);
  const labelFont = Math.min(13, Math.max(9, barWidth * 0.45));

  // Scale for bar heights
  const maxValue = Math.max(...values, 1);
  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([height - padding.bottom, padding.top]);

  // Clear previous content
  svg.selectAll('*').remove();

  // Add background
  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#f8f9fa');

  // Add title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 22)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text('Array Visualization');

  if (stepTypeCaption) {
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#64748b')
      .text(`Step: ${stepTypeCaption}`);
  }

  // Render bars
  svg
    .selectAll('.bar')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => padding.left + i * barWidth + barPadding / 2)
    .attr('y', (d) => yScale(d))
    .attr('width', actualBarWidth)
    .attr('height', (d) => height - padding.bottom - yScale(d))
    .attr('fill', (d, i) => {
      if (arrayState.sortedIndices?.includes(i)) return '#4CAF50';
      if (arrayState.highlightedIndices?.includes(i)) return '#FF6B6B';
      return '#3498DB';
    })
    .attr('opacity', 0.8);

  // Add value labels
  svg
    .selectAll('.value-label')
    .data(values)
    .enter()
    .append('text')
    .attr('class', 'value-label')
    .attr('x', (d, i) => padding.left + i * barWidth + barWidth / 2)
    .attr('y', (d) => yScale(d) - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', `${labelFont}px`)
    .text((d) => d);

  // Add index labels
  svg
    .selectAll('.index-label')
    .data(values)
    .enter()
    .append('text')
    .attr('class', 'index-label')
    .attr('x', (d, i) => padding.left + i * barWidth + barWidth / 2)
    .attr('y', height - 8)
    .attr('text-anchor', 'middle')
    .attr('font-size', `${Math.max(9, labelFont - 1)}px`)
    .attr('fill', '#475569')
    .text((d, i) => i);
}

// ============================================================================
// GRAPH VISUALIZATION (for BFS, DFS, Dijkstra, MST, etc.)
// ============================================================================

export interface GraphRenderMeta {
  queue?: (string | number)[];
  stack?: (string | number)[];
  fringeMode?: 'queue' | 'stack' | 'none';
}

export function renderGraphVisualization(
  svgElement: SVGSVGElement | null,
  nodes: GraphNode[],
  edges: GraphEdge[],
  highlightedEdges?: GraphEdge[],
  meta?: GraphRenderMeta,
): void {
  if (!svgElement) return;

  const svg = d3.select(svgElement);
  const width = Math.max(svgElement.clientWidth || 0, 280);
  const height = Math.max(svgElement.clientHeight || 0, 240);
  const pad = 32;
  const nodeRadius = 22;
  const topInset = meta?.fringeMode ? 44 : 12;

  // Clear previous content
  svg.selectAll('*').remove();

  // Add background
  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#f8f9fa');

  const header = svg.append('g').attr('class', 'engine-overlay');
  const q = meta?.queue?.map(String) ?? [];
  const st = meta?.stack?.map(String) ?? [];
  if (meta?.fringeMode === 'queue') {
    header
      .append('text')
      .attr('x', 16)
      .attr('y', 22)
      .attr('font-size', '13px')
      .attr('fill', '#334155')
      .text(`Queue (front→back): ${q.length ? q.join(' → ') : '∅'}`);
  } else if (meta?.fringeMode === 'stack') {
    header
      .append('text')
      .attr('x', 16)
      .attr('y', 22)
      .attr('font-size', '13px')
      .attr('fill', '#334155')
      .text(`Stack (top→bottom): ${st.length ? st.join(' | ') : '∅'}`);
  } else if (meta?.fringeMode === 'none') {
    header
      .append('text')
      .attr('x', 16)
      .attr('y', 22)
      .attr('font-size', '13px')
      .attr('fill', '#334155')
      .text('Shortest-path distances shown under each node');
  }

  const minX = pad + nodeRadius;
  const maxX = width - pad - nodeRadius;
  const minY = topInset + nodeRadius + 4;
  const maxY = height - pad - nodeRadius;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Initialize node positions inside the drawable region
  const nodesWithPos = nodes.map((node) => ({
    ...node,
    x: clamp(
      node.x ?? Math.random() * (maxX - minX) + minX,
      minX,
      maxX,
    ),
    y: clamp(
      node.y ?? Math.random() * (maxY - minY) + minY,
      minY,
      maxY,
    ),
  }));

  // Create force simulation
  const simulation = d3
    .forceSimulation(nodesWithPos as any)
    .force(
      'link',
      d3
        .forceLink(edges as any)
        .id((d: any) => d.id)
        .distance(100)
    )
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2));

  // Draw edges
  const linkGroup = svg.append('g').attr('class', 'links');

  linkGroup
    .selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .attr('x1', (d: any) => nodesWithPos.find((n) => n.id === d.source)?.x || 0)
    .attr('y1', (d: any) => nodesWithPos.find((n) => n.id === d.source)?.y || 0)
    .attr('x2', (d: any) => nodesWithPos.find((n) => n.id === d.target)?.x || 0)
    .attr('y2', (d: any) => nodesWithPos.find((n) => n.id === d.target)?.y || 0)
    .attr('stroke', (d) =>
      highlightedEdges?.some((he) => (he.source === d.source && he.target === d.target) ||
        (he.source === d.target && he.target === d.source))
        ? '#FF6B6B'
        : '#cccccc'
    )
    .attr('stroke-width', 2)
    .attr('opacity', 0.6);

  // Add edge labels for weighted edges
  linkGroup
    .selectAll('text')
    .data(edges.filter((e) => e.weight))
    .enter()
    .append('text')
    .attr('x', (d: any) => {
      const source = nodesWithPos.find((n) => n.id === d.source);
      const target = nodesWithPos.find((n) => n.id === d.target);
      return ((source?.x || 0) + (target?.x || 0)) / 2;
    })
    .attr('y', (d: any) => {
      const source = nodesWithPos.find((n) => n.id === d.source);
      const target = nodesWithPos.find((n) => n.id === d.target);
      return ((source?.y || 0) + (target?.y || 0)) / 2;
    })
    .attr('font-size', '12px')
    .attr('fill', '#666')
    .text((d) => d.weight || '');

  // Draw nodes
  const nodeGroup = svg.append('g').attr('class', 'nodes');

  nodeGroup
    .selectAll('circle')
    .data(nodesWithPos)
    .enter()
    .append('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('r', 20)
    .attr('fill', (d) => {
      switch (d.color) {
        case 'current':
          return '#FF6B6B';
        case 'visited':
          return '#4CAF50';
        case 'unvisited':
          return '#3498DB';
        default:
          return '#3498DB';
      }
    })
    .attr('opacity', 0.8);

  // Add node labels (id)
  nodeGroup
    .selectAll('text.node-label')
    .data(nodesWithPos)
    .enter()
    .append('text')
    .attr('class', 'node-label')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')
    .text((d) => d.label);

  // Distance labels (Dijkstra)
  nodeGroup
    .selectAll('text.dist-label')
    .data(nodesWithPos)
    .enter()
    .append('text')
    .attr('class', 'dist-label')
    .attr('x', (d) => d.x)
    .attr('y', (d) => (d.y ?? 0) + 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .attr('fill', '#0f172a')
    .text((d) => (d.distance != null ? String(d.distance) : ''));

  // Update positions on simulation tick — keep nodes inside the drawable area
  simulation.on('tick', () => {
    for (const d of nodesWithPos as GraphNode[]) {
      const x = d.x ?? width / 2;
      const y = d.y ?? height / 2;
      d.x = clamp(x, minX, maxX);
      d.y = clamp(y, minY, maxY);
    }

    linkGroup
      .selectAll('line')
      .attr('x1', (d: any) => nodesWithPos.find((n) => n.id === d.source)?.x || 0)
      .attr('y1', (d: any) => nodesWithPos.find((n) => n.id === d.source)?.y || 0)
      .attr('x2', (d: any) => nodesWithPos.find((n) => n.id === d.target)?.x || 0)
      .attr('y2', (d: any) => nodesWithPos.find((n) => n.id === d.target)?.y || 0);

    linkGroup
      .selectAll('text')
      .attr('x', (d: any) => {
        const source = nodesWithPos.find((n) => n.id === d.source);
        const target = nodesWithPos.find((n) => n.id === d.target);
        return ((source?.x || 0) + (target?.x || 0)) / 2;
      })
      .attr('y', (d: any) => {
        const source = nodesWithPos.find((n) => n.id === d.source);
        const target = nodesWithPos.find((n) => n.id === d.target);
        return ((source?.y || 0) + (target?.y || 0)) / 2;
      });

    nodeGroup
      .selectAll('circle')
      .attr('cx', (d: unknown) => (d as GraphNode).x ?? 0)
      .attr('cy', (d: unknown) => (d as GraphNode).y ?? 0);

    nodeGroup
      .selectAll('text.node-label')
      .attr('x', (d: unknown) => (d as GraphNode).x ?? 0)
      .attr('y', (d: unknown) => (d as GraphNode).y ?? 0);

    nodeGroup
      .selectAll('text.dist-label')
      .attr('x', (d: unknown) => (d as GraphNode).x ?? 0)
      .attr('y', (d: unknown) => ((d as GraphNode).y ?? 0) + 30);
  });
}

// ============================================================================
// TREE VISUALIZATION
// ============================================================================

export function renderTreeVisualization(
  svgElement: SVGSVGElement | null,
  root: TreeNode | undefined
): void {
  if (!svgElement || !root) return;

  const svg = d3.select(svgElement);
  const width = Math.max(svgElement.clientWidth || 0, 280);
  const height = Math.max(svgElement.clientHeight || 0, 220);
  const margin = { top: 24, right: 24, bottom: 24, left: 24 };

  // Clear previous content
  svg.selectAll('*').remove();

  // Add background
  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#f8f9fa');

  const innerW = Math.max(width - margin.left - margin.right, 120);
  const innerH = Math.max(height - margin.top - margin.bottom, 120);

  // Calculate tree layout
  const treeLayout = d3.tree<TreeNode>().size([innerW, innerH]);

  const hierarchy = d3.hierarchy(root);
  const treeData = treeLayout(hierarchy);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Draw links
  g
    .selectAll('line')
    .data(treeData.links())
    .enter()
    .append('line')
    .attr('x1', (d) => (d.source as any).x)
    .attr('y1', (d) => (d.source as any).y)
    .attr('x2', (d) => (d.target as any).x)
    .attr('y2', (d) => (d.target as any).y)
    .attr('stroke', '#999')
    .attr('stroke-width', 2);

  // Draw nodes
  g
    .selectAll('circle')
    .data(treeData.descendants())
    .enter()
    .append('circle')
    .attr('cx', (d) => (d as any).x)
    .attr('cy', (d) => (d as any).y)
    .attr('r', 15)
    .attr('fill', (d) => (d.data.visited ? '#4CAF50' : '#3498DB'))
    .attr('opacity', 0.8);

  // Add node labels
  g
    .selectAll('text')
    .data(treeData.descendants())
    .enter()
    .append('text')
    .attr('x', (d) => (d as any).x)
    .attr('y', (d) => (d as any).y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')
    .text((d) => String(d.data.value));
}
