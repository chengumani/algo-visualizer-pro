export const insertionSort = (input) => {
  const arr = [...input];
  const steps = [];

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    steps.push({ type: 'compare', indices: [j, i], message: `Checking where to place ${key}` });
    while (j >= 0 && arr[j] > key) {
      steps.push({ type: 'overwrite', indices: [j + 1], value: arr[j], message: `Shifting ${arr[j]} right` });
      arr[j + 1] = arr[j];
      j -= 1;
    }
    steps.push({ type: 'overwrite', indices: [j + 1], value: key, message: `Insert ${key} at position ${j + 1}` });
    arr[j + 1] = key;
    steps.push({ type: 'markSorted', indices: [0, i], message: `Prefix up to index ${i} is sorted` });
  }
  return steps;
};
