import { DSAlgorithmStep, ArrayState } from '../types';

/**
 * Bubble Sort Algorithm
 * Time: O(n²), Space: O(1)
 */

export function generateBubbleSortSteps(arr: number[]): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  const array = [...arr];
  let stepNumber = 0;

  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    description: 'Initialize array',
    pseudoCode: 'for i = 0 to n-1:',
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

  // Bubble sort logic
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // Highlight elements being compared
      steps.push({
        stepNumber: stepNumber++,
        description: `Compare array[${j}] = ${array[j]} and array[${j + 1}] = ${array[j + 1]}`,
        pseudoCode: 'if arr[j] > arr[j+1]:',
        branch: 'data-structures',
        dataStructure: 'array',
        state: {
          arrays: [
            {
              id: 'main',
              values: array,
              highlightedIndices: [j, j + 1],
              color: 'comparing',
            },
          ],
          comparisons: [{ a: array[j], b: array[j + 1], result: 'comparing' }],
        },
      });

      // Swap if needed
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        steps.push({
          stepNumber: stepNumber++,
          description: `Swap array[${j}] and array[${j + 1}]`,
          pseudoCode: 'swap(arr[j], arr[j+1])',
          branch: 'data-structures',
          dataStructure: 'array',
          state: {
            arrays: [
              {
                id: 'main',
                values: array,
                highlightedIndices: [j, j + 1],
              },
            ],
          },
        });
      }
    }

    // Mark sorted elements
    const sortedIndices = Array.from({ length: i + 1 }, (_, k) => array.length - 1 - k);
    steps.push({
      stepNumber: stepNumber++,
      description: `Pass ${i + 1} complete. Last ${i + 1} element(s) are sorted`,
      pseudoCode: 'End of pass',
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

  // Final state
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
          highlightedIndices: [],
        },
      ],
    },
  });

  return steps;
}

export function validateBubbleSortInput(input: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(input)) {
    return { valid: false, error: 'Input must be an array' };
  }
  if (!input.every((item) => typeof item === 'number')) {
    return { valid: false, error: 'All array elements must be numbers' };
  }
  if (input.length === 0) {
    return { valid: false, error: 'Array cannot be empty' };
  }
  if (input.length > 100) {
    return { valid: false, error: 'Array size should not exceed 100 elements' };
  }
  return { valid: true };
}
