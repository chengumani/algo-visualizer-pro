import { getNeighbors, keyOf, reconstructPath } from './common.js';

const toNode = (key) => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export const astar = (rows, cols, walls, start, end) => {
  const startKey = keyOf(start);
  const endKey = keyOf(end);

  const open = new Map([[startKey, 0]]);
  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, heuristic(start, end)]]);
  const prev = new Map();
  const steps = [];

  while (open.size) {
    const [currentKey] = [...open.entries()].sort((a, b) => a[1] - b[1])[0];
    open.delete(currentKey);
    const current = toNode(currentKey);
    steps.push({ type: 'visit', node: current, message: `Exploring (${current.row}, ${current.col}) with f=${fScore.get(currentKey)}` });
    if (currentKey === endKey) break;

    for (const neighbor of getNeighbors(current, rows, cols)) {
      const nKey = keyOf(neighbor);
      if (walls.has(nKey)) continue;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        prev.set(nKey, currentKey);
        gScore.set(nKey, tentativeG);
        const f = tentativeG + heuristic(neighbor, end);
        fScore.set(nKey, f);
        open.set(nKey, f);
      }
    }
  }

  const pathKeys = reconstructPath(prev, endKey);
  const pathNodes = pathKeys.map(toNode);
  for (const node of pathNodes) {
    steps.push({ type: 'path', node, message: `A* shortest path node (${node.row}, ${node.col})` });
  }

  return steps;
};
