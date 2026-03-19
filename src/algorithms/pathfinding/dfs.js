import { getNeighbors, keyOf, reconstructPath } from './common.js';

const toNode = (key) => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

export const dfs = (rows, cols, walls, start, end) => {
  const startKey = keyOf(start);
  const endKey = keyOf(end);
  const visited = new Set();
  const prev = new Map();
  const stack = [start];
  const steps = [];

  while (stack.length) {
    const node = stack.pop();
    const nodeKey = keyOf(node);
    if (visited.has(nodeKey)) continue;
    visited.add(nodeKey);
    steps.push({ type: 'visit', node, message: `Visiting (${node.row}, ${node.col})` });
    if (nodeKey === endKey) break;

    const neighbors = getNeighbors(node, rows, cols).filter((n) => !walls.has(keyOf(n)));
    for (const neighbor of neighbors.reverse()) {
      const nKey = keyOf(neighbor);
      if (visited.has(nKey)) continue;
      prev.set(nKey, nodeKey);
      stack.push(neighbor);
    }
  }

  const pathKeys = reconstructPath(prev, endKey);
  const pathNodes = pathKeys.map(toNode);
  for (const node of pathNodes) {
    steps.push({ type: 'path', node, message: `Path node (${node.row}, ${node.col})` });
  }

  return steps;
};
