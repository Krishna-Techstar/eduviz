import { DSAlgorithmStep } from '../types';

/**
 * Selection Sort Algorithm
 * Time: O(n²), Space: O(1)
 */

export function generateSelectionSortSteps(arr: number[]): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  const array = [...arr];
  let stepNumber = 0;

  steps.push({
    stepNumber: stepNumber++,
    description: 'Initialize selection sort',
    pseudoCode: 'for i = 0 to n-1:\n  find min in arr[i..n-1]\n  swap arr[i] with min',
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [
        {
          id: 'main',
          values: array,
          highlightedIndices: [],
        },
      ],
    },
  });

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;

    for (let j = i + 1; j < array.length; j++) {
      steps.push({
        stepNumber: stepNumber++,
        description: `Compare arr[${j}] = ${array[j]} with current min arr[${minIdx}] = ${array[minIdx]}`,
        pseudoCode: 'if arr[j] < arr[minIdx]: minIdx = j',
        branch: 'data-structures',
        dataStructure: 'array',
        state: {
          arrays: [
            {
              id: 'main',
              values: array,
              highlightedIndices: [i, minIdx, j],
              color: 'comparing',
            },
          ],
        },
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];

      steps.push({
        stepNumber: stepNumber++,
        description: `Swap arr[${i}] and arr[${minIdx}]`,
        pseudoCode: 'swap(arr[i], arr[minIdx])',
        branch: 'data-structures',
        dataStructure: 'array',
        state: {
          arrays: [
            {
              id: 'main',
              values: array,
              highlightedIndices: [i, minIdx],
            },
          ],
        },
      });
    }

    const sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({
      stepNumber: stepNumber++,
      description: `Position ${i} sorted. Minimum element ${array[i]} in place`,
      pseudoCode: 'End of iteration',
      branch: 'data-structures',
      dataStructure: 'array',
      state: {
        arrays: [
          {
            id: 'main',
            values: array,
            sortedIndices,
            highlightedIndices: [],
          },
        ],
      },
    });
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Array is sorted',
    pseudoCode: 'Done',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [
        {
          id: 'main',
          values: array,
          sortedIndices: Array.from({ length: array.length }, (_, i) => i),
        },
      ],
    },
  });

  return steps;
}

export function validateSelectionSortInput(input: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(input)) {
    return { valid: false, error: 'Input must be an array' };
  }
  if (!input.every((item) => typeof item === 'number')) {
    return { valid: false, error: 'All array elements must be numbers' };
  }
  if (input.length === 0) {
    return { valid: false, error: 'Array cannot be empty' };
  }
  return { valid: true };
}
