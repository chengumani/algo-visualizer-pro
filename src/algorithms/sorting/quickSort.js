export const quickSort = (input) => {
  const arr = [...input];
  const steps = [];

  const partition = (low, high) => {
    const pivot = arr[high];
    let i = low;
    steps.push({ type: 'pivot', indices: [high], message: `Pivot chosen: ${pivot}` });

    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', indices: [j, high], message: `Is ${arr[j]} <= pivot ${pivot}?` });
      if (arr[j] <= pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ type: 'swap', indices: [i, j], message: `Swap ${arr[i]} with ${arr[j]}` });
        i++;
      }
    }
    [arr[i], arr[high]] = [arr[high], arr[i]];
    steps.push({ type: 'swap', indices: [i, high], message: `Place pivot at position ${i}` });
    steps.push({ type: 'markSorted', indices: [i], message: `Pivot ${pivot} fixed` });
    return i;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  sort(0, arr.length - 1);
  steps.push({ type: 'markSorted', indices: arr.map((_, idx) => idx), message: 'Quick sort completed' });
  return steps;
};
