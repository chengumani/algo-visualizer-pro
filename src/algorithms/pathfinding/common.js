export const keyOf = ({ row, col }) => `${row}-${col}`;

export const getNeighbors = (node, rows, cols) => {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const neighbors = [];
  for (const [dr, dc] of dirs) {
    const nr = node.row + dr;
    const nc = node.col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbors.push({ row: nr, col: nc });
    }
  }
  return neighbors;
};

export const reconstructPath = (cameFrom, endKey) => {
  const path = [];
  let current = endKey;
  while (current && cameFrom.has(current)) {
    path.push(current);
    current = cameFrom.get(current);
  }
  return path.reverse();
};
