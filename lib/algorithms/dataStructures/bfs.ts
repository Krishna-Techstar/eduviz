import { DSAlgorithmStep, GraphNode, GraphEdge } from '../types';

/**
 * Breadth-First Search Algorithm
 * Time: O(V + E), Space: O(V)
 */

export function generateBFSSteps(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string | number
): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  let stepNumber = 0;

  // Build adjacency list
  const adj = new Map<string | number, (string | number)[]>();
  nodes.forEach((node) => adj.set(node.id, []));
  edges.forEach((edge) => {
    if (adj.has(edge.source)) {
      adj.get(edge.source)!.push(edge.target);
    }
    if (adj.has(edge.target)) {
      adj.get(edge.target)!.push(edge.source);
    }
  });

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: `Initialize BFS from node ${startNodeId}`,
    pseudoCode: 'queue.enqueue(startNode)\nvisited.add(startNode)',
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: nodes.map((n) => ({
          ...n,
          visited: false,
          color: 'unvisited' as const,
        })),
        edges: edges,
      },
    },
  });

  const visited = new Set<string | number>();
  const queue: (string | number)[] = [startNodeId];
  visited.add(startNodeId);

  steps.push({
    stepNumber: stepNumber++,
    description: `Add node ${startNodeId} to queue`,
    pseudoCode: 'queue = [startNode]',
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: nodes.map((n) => ({
          ...n,
          visited: n.id === startNodeId,
          color: n.id === startNodeId ? ('current' as const) : ('unvisited' as const),
        })),
        edges: edges,
      },
      highlightedNodes: [startNodeId],
    },
  });

  // BFS traversal
  const order: (string | number)[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    steps.push({
      stepNumber: stepNumber++,
      description: `Dequeue node ${current}. Processing neighbors: ${adj.get(current)?.join(', ') || 'none'}`,
      pseudoCode: 'current = queue.dequeue()',
      branch: 'data-structures',
      dataStructure: 'graph',
      state: {
        graph: {
          nodes: nodes.map((n) => ({
            ...n,
            visited: visited.has(n.id),
            color: n.id === current ? ('current' as const) : visited.has(n.id) ? ('visited' as const) : ('unvisited' as const),
          })),
          edges: edges,
        },
        highlightedNodes: [current],
      },
    });

    const neighbors = adj.get(current) || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        steps.push({
          stepNumber: stepNumber++,
          description: `Found unvisited neighbor ${neighbor}. Add to queue`,
          pseudoCode: 'if not visited(neighbor):\n  queue.enqueue(neighbor)\n  visited.add(neighbor)',
          branch: 'data-structures',
          dataStructure: 'graph',
          state: {
            graph: {
              nodes: nodes.map((n) => ({
                ...n,
                visited: visited.has(n.id),
                color: n.id === neighbor ? ('current' as const) : visited.has(n.id) ? ('visited' as const) : ('unvisited' as const),
              })),
              edges: edges,
            },
            highlightedNodes: [current, neighbor],
          },
        });
      }
    }
  }

  // Final state
  steps.push({
    stepNumber: stepNumber++,
    description: `BFS complete. Traversal order: ${order.join(' -> ')}`,
    pseudoCode: 'Queue empty, algorithm done',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    branch: 'data-structures',
    dataStructure: 'graph',
    state: {
      graph: {
        nodes: nodes.map((n) => ({
          ...n,
          visited: true,
          color: 'visited' as const,
        })),
        edges: edges,
      },
    },
  });

  return steps;
}

export function validateBFSInput(input: {
  nodes?: unknown;
  edges?: unknown;
  startNodeId?: unknown;
}): { valid: boolean; error?: string } {
  if (!Array.isArray(input.nodes) || input.nodes.length === 0) {
    return { valid: false, error: 'Nodes must be a non-empty array' };
  }
  if (!Array.isArray(input.edges)) {
    return { valid: false, error: 'Edges must be an array' };
  }
  if (!input.startNodeId) {
    return { valid: false, error: 'Start node ID is required' };
  }
  return { valid: true };
}
