import { bfs } from "../algorithms/bfs.js";
import { dfs } from "../algorithms/dfs.js";
import { dijkstra } from "../algorithms/dijkstra.js";
import { bubbleSort, mergeSort } from "../algorithms/sorting.js";
import { binaryTreeTraversal } from "../algorithms/binaryTreeTraversal.js";
export function runAlgorithm(type, input) {
    switch (type) {
        case "bfs": {
            const g = input;
            return bfs(g.graph, g.start);
        }
        case "dfs": {
            const g = input;
            return dfs(g.graph, g.start);
        }
        case "dijkstra": {
            const g = input;
            return dijkstra(g.graph, g.source);
        }
        case "bubbleSort": {
            const s = input;
            return bubbleSort(s.array);
        }
        case "mergeSort": {
            const s = input;
            return mergeSort(s.array);
        }
        case "binaryTreeTraversal": {
            const t = input;
            return binaryTreeTraversal(t.tree, t.order);
        }
        default: {
            const _exhaustive = type;
            throw new Error(`Unsupported algorithm: ${_exhaustive}`);
        }
    }
}
export const COMPLEXITY = {
    bfs: { time: "O(V + E)", space: "O(V)" },
    dfs: { time: "O(V + E)", space: "O(V)" },
    dijkstra: { time: "O(V^2) (this engine)", space: "O(V)" },
    bubbleSort: { time: "O(n²)", space: "O(1)" },
    mergeSort: { time: "O(n log n)", space: "O(n)" },
    binaryTreeTraversal: { time: "O(n)", space: "O(h)" },
};
//# sourceMappingURL=algorithmDispatcher.js.map