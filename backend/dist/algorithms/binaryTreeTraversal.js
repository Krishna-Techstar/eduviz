import { makeStep, resetStepSequence } from "../utils/stepFormatter.js";
function cloneTree(node) {
    if (node == null)
        return null;
    return {
        val: node.val,
        left: cloneTree(node.left ?? null),
        right: cloneTree(node.right ?? null),
    };
}
export function binaryTreeTraversal(root, order = "inorder") {
    resetStepSequence();
    const steps = [];
    const snapshot = () => cloneTree(root);
    steps.push(makeStep({
        type: "init",
        current: String(root.val),
        treeSnapshot: snapshot(),
        explanation: `Begin ${order} traversal.`,
        highlight: { nodes: [String(root.val)], edges: [] },
    }));
    const visit = (label, nodeVal) => {
        steps.push(makeStep({
            type: "visit",
            current: String(nodeVal),
            treeSnapshot: snapshot(),
            explanation: `${label}: visit node ${nodeVal}.`,
            highlight: { nodes: [String(nodeVal)], edges: [] },
        }));
    };
    const walkInorder = (n, path) => {
        if (!n)
            return;
        walkInorder(n.left, `${path}.left`);
        visit("Inorder", n.val);
        walkInorder(n.right, `${path}.right`);
    };
    const walkPreorder = (n) => {
        if (!n)
            return;
        visit("Preorder", n.val);
        walkPreorder(n.left);
        walkPreorder(n.right);
    };
    const walkPostorder = (n) => {
        if (!n)
            return;
        walkPostorder(n.left);
        walkPostorder(n.right);
        visit("Postorder", n.val);
    };
    if (order === "inorder")
        walkInorder(root, "root");
    else if (order === "preorder")
        walkPreorder(root);
    else
        walkPostorder(root);
    steps.push(makeStep({
        type: "complete",
        current: null,
        treeSnapshot: snapshot(),
        explanation: `${order} traversal complete.`,
        highlight: { nodes: [], edges: [] },
    }));
    return steps;
}
//# sourceMappingURL=binaryTreeTraversal.js.map