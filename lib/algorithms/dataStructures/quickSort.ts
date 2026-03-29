import { DSAlgorithmStep } from '../types';

function partition(
  a: number[],
  low: number,
  high: number,
  steps: DSAlgorithmStep[],
  stepNumber: { n: number },
): number {
  const pivot = a[high];
  steps.push({
    stepNumber: stepNumber.n++,
    description: `Partition: pivot = a[${high}] = ${pivot}`,
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [{ id: 'main', values: [...a], highlightedIndices: [high] }],
    },
  });

  let i = low - 1;
  for (let j = low; j < high; j++) {
    steps.push({
      stepNumber: stepNumber.n++,
      description: `Compare a[${j}] = ${a[j]} with pivot ${pivot}`,
      branch: 'data-structures',
      dataStructure: 'array',
      state: {
        arrays: [{ id: 'main', values: [...a], highlightedIndices: [j, high] }],
      },
    });
    if (a[j] <= pivot) {
      i++;
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({
          stepNumber: stepNumber.n++,
          description: `Swap a[${i}] and a[${j}]`,
          branch: 'data-structures',
          dataStructure: 'array',
          state: {
            arrays: [{ id: 'main', values: [...a], highlightedIndices: [i, j] }],
          },
        });
      }
    }
  }
  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  steps.push({
    stepNumber: stepNumber.n++,
    description: `Place pivot at index ${i + 1}`,
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [{ id: 'main', values: [...a], highlightedIndices: [i + 1] }],
    },
  });
  return i + 1;
}

function quick(
  a: number[],
  low: number,
  high: number,
  steps: DSAlgorithmStep[],
  stepNumber: { n: number },
): void {
  if (low < high) {
    steps.push({
      stepNumber: stepNumber.n++,
      description: `Recurse on range [${low}, ${high}]`,
      branch: 'data-structures',
      dataStructure: 'array',
      state: {
        arrays: [
          {
            id: 'main',
            values: [...a],
            highlightedIndices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
          },
        ],
      },
    });
    const p = partition(a, low, high, steps, stepNumber);
    quick(a, low, p - 1, steps, stepNumber);
    quick(a, p + 1, high, steps, stepNumber);
  }
}

export function generateQuickSortSteps(arr: number[]): DSAlgorithmStep[] {
  if (arr.length === 0) return [];
  const a = [...arr];
  const steps: DSAlgorithmStep[] = [];
  const stepNumber = { n: 0 };

  steps.push({
    stepNumber: stepNumber.n++,
    description: 'Start quicksort (Lomuto partition)',
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [{ id: 'main', values: [...a], highlightedIndices: [] }],
    },
  });

  quick(a, 0, a.length - 1, steps, stepNumber);

  steps.push({
    stepNumber: stepNumber.n++,
    description: 'Array sorted',
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [{ id: 'main', values: [...a], highlightedIndices: [] }],
    },
  });

  return steps;
}
