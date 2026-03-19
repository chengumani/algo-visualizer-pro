export const selectionSort = (input) => {
  const arr = [...input];
  const steps = [];

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ type: 'compare', indices: [minIndex, j], message: `Comparing current min ${arr[minIndex]} with ${arr[j]}` });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push({ type: 'swap', indices: [i, minIndex], message: `Swapping ${arr[i]} with ${arr[minIndex]}` });
    }
    steps.push({ type: 'markSorted', indices: [i], message: `Position ${i + 1} sorted` });
  }
  return steps;
};
