export const bubbleSort = (input) => {
  const arr = [...input];
  const steps = [];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1], message: `Comparing ${arr[j]} and ${arr[j + 1]}` });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ type: 'swap', indices: [j, j + 1], message: `Swapping ${arr[j]} and ${arr[j + 1]}` });
      }
    }
    steps.push({ type: 'markSorted', indices: [arr.length - i - 1], message: `Position ${arr.length - i} locked` });
  }
  steps.push({ type: 'markSorted', indices: [0], message: 'Array fully sorted' });
  return steps;
};
