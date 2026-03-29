import { DSAlgorithmStep } from '../types';

export function generateInsertionSortSteps(arr: number[]): DSAlgorithmStep[] {
  const steps: DSAlgorithmStep[] = [];
  const a = [...arr];
  let stepNumber = 0;

  steps.push({
    stepNumber: stepNumber++,
    description: 'Start insertion sort',
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [{ id: 'main', values: [...a], highlightedIndices: [] }],
    },
  });

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    steps.push({
      stepNumber: stepNumber++,
      description: `Key = a[${i}] = ${key}; shift larger elements right`,
      branch: 'data-structures',
      dataStructure: 'array',
      state: {
        arrays: [{ id: 'main', values: [...a], highlightedIndices: [i] }],
      },
    });

    while (j >= 0 && a[j] > key) {
      steps.push({
        stepNumber: stepNumber++,
        description: `a[${j}] = ${a[j]} > key ${key} → move a[${j}] to a[${j + 1}]`,
        branch: 'data-structures',
        dataStructure: 'array',
        state: {
          arrays: [{ id: 'main', values: [...a], highlightedIndices: [j, j + 1] }],
        },
      });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;

    steps.push({
      stepNumber: stepNumber++,
      description: `Insert key ${key} at index ${j + 1}`,
      branch: 'data-structures',
      dataStructure: 'array',
      state: {
        arrays: [{ id: 'main', values: [...a], highlightedIndices: [j + 1] }],
      },
    });
  }

  steps.push({
    stepNumber: stepNumber++,
    description: 'Array sorted',
    branch: 'data-structures',
    dataStructure: 'array',
    state: {
      arrays: [{ id: 'main', values: [...a], highlightedIndices: [] }],
    },
  });

  return steps;
}
