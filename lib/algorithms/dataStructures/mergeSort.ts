import { DSAlgorithmStep } from '../types';

/**
 * Merge Sort Algorithm
 * Time: O(n log n), Space: O(n)
 */

export function generateMergeSortSteps(arr: number[]): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  const array = [...arr];
  let stepNumber = 0;

  const helper = (
    arr: number[],
    left: number,
    right: number,
    depth: number = 0
  ): number[] => {
    if (left >= right) {
      if (left === right) {
        steps.push({
          stepNumber: stepNumber++,
          description: `Base case: single element arr[${left}] = ${arr[left]}`,
          pseudoCode: 'if left >= right: return',
          branch: 'data-structures',
          dataStructure: 'array',
          state: {
            arrays: [
              {
                id: 'main',
                values: arr,
                highlightedIndices: [left],
              },
            ],
          },
        });
      }
      return arr.slice(left, right + 1);
    }

    const mid = Math.floor((left + right) / 2);

    steps.push({
      stepNumber: stepNumber++,
      description: `Divide: split array into [${left}...${mid}] and [${mid + 1}...${right}]`,
      pseudoCode: 'mid = (left + right) / 2',
      branch: 'data-structures',
      dataStructure: 'array',
      state: {
        arrays: [
          {
            id: 'main',
            values: arr,
            highlightedIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          },
        ],
      },
    });

    const left_part = helper(arr, left, mid, depth + 1);
    const right_part = helper(arr, mid + 1, right, depth + 1);

    const merged = merge(arr, left, mid, right, left_part, right_part, stepNumber);
    stepNumber += merged.steps;

    return merged.result;
  };

  helper(array, 0, array.length - 1);

  steps.push({
    stepNumber: stepNumber++,
    description: 'Array is sorted',
    pseudoCode: 'Done',
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
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

function merge(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  left_part: number[],
  right_part: number[],
  stepNum: number
): { result: number[]; steps: number } {
  const merged: number[] = [];
  let i = 0,
    j = 0,
    k = left;
  let steps = 0;

  while (i < left_part.length && j < right_part.length) {
    if (left_part[i] <= right_part[j]) {
      arr[k] = left_part[i];
      merged.push(left_part[i]);
      i++;
    } else {
      arr[k] = right_part[j];
      merged.push(right_part[j]);
      j++;
    }
    k++;
  }

  while (i < left_part.length) {
    arr[k] = left_part[i];
    merged.push(left_part[i]);
    i++;
    k++;
  }

  while (j < right_part.length) {
    arr[k] = right_part[j];
    merged.push(right_part[j]);
    j++;
    k++;
  }

  return { result: merged, steps };
}

export function validateMergeSortInput(input: unknown): { valid: boolean; error?: string } {
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
