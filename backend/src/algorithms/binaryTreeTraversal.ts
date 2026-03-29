import type { BinaryTreeNode } from "../types/tree.js";
import type { VisualizationStep } from "../models/stepSchema.js";
import { makeStep, resetStepSequence } from "../utils/stepFormatter.js";

export type TraversalOrder = "inorder" | "preorder" | "postorder";

function cloneTree(node: BinaryTreeNode | null | undefined): BinaryTreeNode | null {
  if (node == null) return null;
  return {
    val: node.val,
    left: cloneTree(node.left ?? null),
    right: cloneTree(node.right ?? null),
  };
}

export function binaryTreeTraversal(
  root: BinaryTreeNode,
  order: TraversalOrder = "inorder",
): VisualizationStep[] {
  resetStepSequence();
  const steps: VisualizationStep[] = [];
  const snapshot = () => cloneTree(root);

  steps.push(
    makeStep({
      type: "init",
      current: String(root.val),
      treeSnapshot: snapshot(),
      explanation: `Begin ${order} traversal.`,
      highlight: { nodes: [String(root.val)], edges: [] },
    }),
  );

  const visit = (label: string, nodeVal: string | number) => {
    steps.push(
      makeStep({
        type: "visit",
        current: String(nodeVal),
        treeSnapshot: snapshot(),
        explanation: `${label}: visit node ${nodeVal}.`,
        highlight: { nodes: [String(nodeVal)], edges: [] },
      }),
    );
  };

  const walkInorder = (n: BinaryTreeNode | null | undefined, path: string): void => {
    if (!n) return;
    walkInorder(n.left, `${path}.left`);
    visit("Inorder", n.val);
    walkInorder(n.right, `${path}.right`);
  };

  const walkPreorder = (n: BinaryTreeNode | null | undefined): void => {
    if (!n) return;
    visit("Preorder", n.val);
    walkPreorder(n.left);
    walkPreorder(n.right);
  };

  const walkPostorder = (n: BinaryTreeNode | null | undefined): void => {
    if (!n) return;
    walkPostorder(n.left);
    walkPostorder(n.right);
    visit("Postorder", n.val);
  };

  if (order === "inorder") walkInorder(root, "root");
  else if (order === "preorder") walkPreorder(root);
  else walkPostorder(root);

  steps.push(
    makeStep({
      type: "complete",
      current: null,
      treeSnapshot: snapshot(),
      explanation: `${order} traversal complete.`,
      highlight: { nodes: [], edges: [] },
    }),
  );

  return steps;
}
