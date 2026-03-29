import { DSAlgorithmStep, GraphNode, GraphEdge } from '../types';

/**
 * Depth-First Search Algorithm
 * Time: O(V + E), Space: O(V)
 */

export function generateDFSSteps(
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
    description: `Initialize DFS from node ${startNodeId}`,
    pseudoCode: 'stack.push(startNode)\nvisited.add(startNode)',
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
  const stack: (string | number)[] = [startNodeId];
  const order: (string | number)[] = [];

  steps.push({
    stepNumber: stepNumber++,
    description: `Add node ${startNodeId} to stack`,
    pseudoCode: 'stack = [startNode]',
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

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!visited.has(current)) {
      visited.add(current);
      order.push(current);

      steps.push({
        stepNumber: stepNumber++,
        description: `Visit node ${current}. Neighbors: ${adj.get(current)?.join(', ') || 'none'}`,
        pseudoCode: 'current = stack.pop()\nvisited.add(current)',
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

      // Push neighbors in reverse order to maintain left-to-right order in stack
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);

          steps.push({
            stepNumber: stepNumber++,
            description: `Found unvisited neighbor ${neighbor}. Add to stack`,
            pseudoCode: 'if not visited(neighbor):\n  stack.push(neighbor)',
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
  }

  // Final state
  steps.push({
    stepNumber: stepNumber++,
    description: `DFS complete. Traversal order: ${order.join(' -> ')}`,
    pseudoCode: 'Stack empty, algorithm done',
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

export function validateDFSInput(input: {
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
