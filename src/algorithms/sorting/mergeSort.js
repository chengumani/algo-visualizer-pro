export const mergeSort = (input) => {
  const arr = [...input];
  const steps = [];

  const merge = (left, mid, right) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ type: 'compare', indices: [left + i, mid + 1 + j], message: `Compare ${leftArr[i]} and ${rightArr[j]}` });
      if (leftArr[i] <= rightArr[j]) {
        steps.push({ type: 'overwrite', indices: [k], value: leftArr[i], message: `Place ${leftArr[i]} at position ${k}` });
        arr[k] = leftArr[i];
        i++;
      } else {
        steps.push({ type: 'overwrite', indices: [k], value: rightArr[j], message: `Place ${rightArr[j]} at position ${k}` });
        arr[k] = rightArr[j];
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      steps.push({ type: 'overwrite', indices: [k], value: leftArr[i], message: `Place ${leftArr[i]} at position ${k}` });
      arr[k++] = leftArr[i++];
    }
    while (j < rightArr.length) {
      steps.push({ type: 'overwrite', indices: [k], value: rightArr[j], message: `Place ${rightArr[j]} at position ${k}` });
      arr[k++] = rightArr[j++];
    }
    steps.push({ type: 'markSorted', indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx), message: `Segment ${left}-${right} merged` });
  };

  const divide = (l, r) => {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    divide(l, mid);
    divide(mid + 1, r);
    merge(l, mid, r);
  };

  divide(0, arr.length - 1);
  return steps;
};
