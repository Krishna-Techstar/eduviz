import type { VisualizationStep } from "../models/stepSchema.js";
import { makeStep, resetStepSequence } from "../utils/stepFormatter.js";

function toComparableArray(arr: (number | string)[]): number[] {
  const nums = arr.map((x) => (typeof x === "number" ? x : Number(x)));
  if (nums.some((n) => Number.isNaN(n))) {
    throw new Error("bubbleSort/mergeSort require numeric values (or numeric strings).");
  }
  return nums;
}

export function bubbleSort(values: (number | string)[]): VisualizationStep[] {
  resetStepSequence();
  const steps: VisualizationStep[] = [];
  const a = toComparableArray(values);

  steps.push(
    makeStep({
      type: "init",
      current: null,
      array: [...a],
      comparing: null,
      explanation: "Start bubble sort.",
      highlight: { nodes: [], edges: [] },
    }),
  );

  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(
        makeStep({
          type: "compare",
          current: j,
          array: [...a],
          comparing: [j, j + 1],
          explanation: `Compare a[${j}] and a[${j + 1}].`,
          highlight: { nodes: [], edges: [] },
        }),
      );
      if (a[j] > a[j + 1]) {
        const t = a[j];
        a[j] = a[j + 1];
        a[j + 1] = t;
        steps.push(
          makeStep({
            type: "swap",
            current: j,
            array: [...a],
            comparing: [j, j + 1],
            explanation: `Swap a[${j}] and a[${j + 1}].`,
            highlight: { nodes: [], edges: [] },
          }),
        );
      }
    }
  }

  steps.push(
    makeStep({
      type: "complete",
      current: null,
      array: [...a],
      comparing: null,
      explanation: "Array is sorted.",
      highlight: { nodes: [], edges: [] },
    }),
  );

  return steps;
}

function mergeHalves(
  a: number[],
  left: number,
  mid: number,
  right: number,
  steps: VisualizationStep[],
): void {
  const L = a.slice(left, mid + 1);
  const R = a.slice(mid + 1, right + 1);
  let i = 0;
  let j = 0;
  let k = left;
  while (i < L.length && j < R.length) {
    steps.push(
      makeStep({
        type: "merge_compare",
        current: k,
        array: [...a],
        comparing: [left + i, mid + 1 + j],
        explanation: `Merge: compare left[${i}] vs right[${j}].`,
        highlight: { nodes: [], edges: [] },
      }),
    );
    if (L[i] <= R[j]) {
      a[k++] = L[i++];
    } else {
      a[k++] = R[j++];
    }
    steps.push(
      makeStep({
        type: "merge_write",
        current: k - 1,
        array: [...a],
        comparing: null,
        explanation: `Write merged value at index ${k - 1}.`,
        highlight: { nodes: [], edges: [] },
      }),
    );
  }
  while (i < L.length) {
    a[k++] = L[i++];
    steps.push(
      makeStep({
        type: "merge_copy",
        current: k - 1,
        array: [...a],
        comparing: null,
        explanation: `Copy remaining left segment to index ${k - 1}.`,
        highlight: { nodes: [], edges: [] },
      }),
    );
  }
  while (j < R.length) {
    a[k++] = R[j++];
    steps.push(
      makeStep({
        type: "merge_copy",
        current: k - 1,
        array: [...a],
        comparing: null,
        explanation: `Copy remaining right segment to index ${k - 1}.`,
        highlight: { nodes: [], edges: [] },
      }),
    );
  }
}

function mergeSortRange(a: number[], left: number, right: number, steps: VisualizationStep[]): void {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  steps.push(
    makeStep({
      type: "divide",
      current: mid,
      array: [...a],
      comparing: [left, right],
      explanation: `Divide range [${left}, ${right}] at mid ${mid}.`,
      highlight: { nodes: [], edges: [] },
    }),
  );
  mergeSortRange(a, left, mid, steps);
  mergeSortRange(a, mid + 1, right, steps);
  mergeHalves(a, left, mid, right, steps);
}

export function mergeSort(values: (number | string)[]): VisualizationStep[] {
  resetStepSequence();
  const steps: VisualizationStep[] = [];
  const a = toComparableArray(values);

  steps.push(
    makeStep({
      type: "init",
      current: null,
      array: [...a],
      comparing: null,
      explanation: "Start merge sort.",
      highlight: { nodes: [], edges: [] },
    }),
  );

  mergeSortRange(a, 0, a.length - 1, steps);

  steps.push(
    makeStep({
      type: "complete",
      current: null,
      array: [...a],
      comparing: null,
      explanation: "Array is sorted.",
      highlight: { nodes: [], edges: [] },
    }),
  );

  return steps;
}
