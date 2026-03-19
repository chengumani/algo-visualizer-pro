import { getNeighbors, keyOf, reconstructPath } from './common.js';

const toNode = (key) => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

export const bfs = (rows, cols, walls, start, end) => {
  const startKey = keyOf(start);
  const endKey = keyOf(end);
  const visited = new Set([startKey]);
  const prev = new Map();
  const queue = [start];
  const steps = [];

  while (queue.length) {
    const node = queue.shift();
    const nodeKey = keyOf(node);
    steps.push({ type: 'visit', node, message: `Exploring (${node.row}, ${node.col})` });
    if (nodeKey === endKey) break;

    for (const neighbor of getNeighbors(node, rows, cols)) {
      const nKey = keyOf(neighbor);
      if (visited.has(nKey) || walls.has(nKey)) continue;
      visited.add(nKey);
      prev.set(nKey, nodeKey);
      queue.push(neighbor);
    }
  }

  const pathKeys = reconstructPath(prev, endKey);
  const pathNodes = pathKeys.map(toNode);
  for (const node of pathNodes) {
    steps.push({ type: 'path', node, message: `Path node (${node.row}, ${node.col})` });
  }

  return steps;
};
