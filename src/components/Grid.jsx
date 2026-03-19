const stateClass = (key, { startKey, endKey, path, visited, frontier, walls }) => {
  if (key === startKey) return 'bg-[#00ff88] text-ink font-bold';
  if (key === endKey) return 'bg-[#ff4d4d] text-white font-bold';
  if (path.has(key)) return 'bg-[#ffd700] path-glow text-slate-900 font-semibold';
  if (walls.has(key)) return 'bg-[#1a1a1a]';
  if (frontier && frontier.has(key)) return 'bg-[#b366ff]/80';
  if (visited.has(key)) return 'bg-[#4da6ff]/80';
  return 'bg-white/5 hover:bg-white/10';
};

const Grid = ({ rows, cols, startKey, endKey, path, visited, frontier, walls, onCellDown, onCellEnter, onMouseUp }) => {
  return (
    <div className="glass-panel p-4 border border-white/5" onMouseUp={onMouseUp}>
      <div
        className="grid gap-[2px] bg-white/5 rounded-xl p-3 overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const key = `${r}-${c}`;
            return (
              <div
                key={key}
                onMouseDown={() => onCellDown(r, c)}
                onMouseEnter={() => onCellEnter(r, c)}
                className={`aspect-square rounded-sm border border-white/5 transition-all duration-150 ${stateClass(key, {
                  startKey,
                  endKey,
                  path,
                  visited,
                  frontier,
                  walls,
                })}`}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Grid;
