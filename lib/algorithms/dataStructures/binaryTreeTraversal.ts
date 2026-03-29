import { SAMPLE_TREES } from '../constants';
import { DSAlgorithmStep, TreeNode } from '../types';

/** Converts the sample binary tree from constants into a TreeNode graph. */
export function treeFromSampleBinary(): TreeNode {
  function conv(n: Record<string, unknown>, path: string): TreeNode {
    return {
      id: path,
      value: n.value as number,
      left: n.left ? conv(n.left as Record<string, unknown>, `${path}L`) : undefined,
      right: n.right ? conv(n.right as Record<string, unknown>, `${path}R`) : undefined,
    };
  }
  return conv(SAMPLE_TREES.binary as unknown as Record<string, unknown>, 'r');
}

function cloneMark(
  root: TreeNode,
  visitedValues: Set<string | number>,
  current: string | number | null,
): TreeNode {
  const mark = (n: TreeNode): TreeNode => ({
    ...n,
    visited: visitedValues.has(n.value) || n.value === current,
    left: n.left ? mark(n.left) : undefined,
    right: n.right ? mark(n.right) : undefined,
  });
  return mark(root);
}

export function generateBinaryTreeTraversalSteps(
  root: TreeNode,
  order: 'inorder' | 'preorder' | 'postorder',
): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  let stepNumber = 0;
  const visited = new Set<string | number>();

  const emit = (val: string | number, label: string) => {
    visited.add(val);
    steps.push({
      stepNumber: stepNumber++,
      description: `${label}: visit node ${val}`,
      branch: 'data-structures',
      dataStructure: 'tree',
      state: {
        tree: {
          root: cloneMark(root, visited, val),
          highlightedNodes: [val],
        },
      },
    });
  };

  const inorder = (n: TreeNode | undefined) => {
    if (!n) return;
    inorder(n.left);
    emit(n.value, 'Inorder');
    inorder(n.right);
  };
  const preorder = (n: TreeNode | undefined) => {
    if (!n) return;
    emit(n.value, 'Preorder');
    preorder(n.left);
    preorder(n.right);
  };
  const postorder = (n: TreeNode | undefined) => {
    if (!n) return;
    postorder(n.left);
    postorder(n.right);
    emit(n.value, 'Postorder');
  };

  steps.push({
    stepNumber: stepNumber++,
    description: `Begin ${order} traversal`,
    branch: 'data-structures',
    dataStructure: 'tree',
    state: {
      tree: { root: cloneMark(root, new Set(), null) },
    },
  });

  if (order === 'inorder') inorder(root);
  else if (order === 'preorder') preorder(root);
  else postorder(root);

  steps.push({
    stepNumber: stepNumber++,
    description: `${order} complete`,
    branch: 'data-structures',
    dataStructure: 'tree',
    state: {
      tree: { root: cloneMark(root, visited, null) },
    },
  });

  return steps;
}
