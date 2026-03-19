import { getNeighbors, keyOf, reconstructPath } from './common.js';

const toNode = (key) => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

export const dijkstra = (rows, cols, walls, start, end) => {
  const startKey = keyOf(start);
  const endKey = keyOf(end);
  const dist = new Map([[startKey, 0]]);
  const prev = new Map();
  const visited = new Set();
  const steps = [];
  const queue = [{ key: startKey, node: start, distance: 0 }];

  while (queue.length) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();
    if (!current) break;
    if (visited.has(current.key)) continue;
    visited.add(current.key);
    steps.push({ type: 'visit', node: current.node, message: `Settled (${current.node.row}, ${current.node.col}) at distance ${current.distance}` });
    if (current.key === endKey) break;

    for (const neighbor of getNeighbors(current.node, rows, cols)) {
      const nKey = keyOf(neighbor);
      if (walls.has(nKey)) continue;
      const newDist = (dist.get(current.key) ?? Infinity) + 1;
      if (newDist < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, newDist);
        prev.set(nKey, current.key);
        queue.push({ key: nKey, node: neighbor, distance: newDist });
      }
    }
  }

  const pathKeys = reconstructPath(prev, endKey);
  const pathNodes = pathKeys.map(toNode);
  for (const node of pathNodes) {
    steps.push({ type: 'path', node, message: `Shortest path node (${node.row}, ${node.col})` });
  }

  return steps;
};
