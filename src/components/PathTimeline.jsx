import React from 'react';

const nodeLabel = (key) => {
  const [r, c] = key.split('-').map(Number);
  return `(${r},${c})`;
};

const PathTimeline = ({ visitedOrder, pathSet, startKey, endKey }) => {
  if (!visitedOrder.length) return null;
  const maxShow = 80;
  const items = visitedOrder.slice(0, maxShow);
  return (
    <div className="glass-panel border border-white/5 p-3 mt-4">
      <p className="text-sm text-slate-200 mb-2">Traversal timeline (in order visited){visitedOrder.length > maxShow ? ` • showing first ${maxShow}` : ''}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((key, idx) => {
          const isPath = pathSet.has(key);
          const isStart = key === startKey;
          const isEnd = key === endKey;
          return (
            <div
              key={key + idx}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] border border-white/10 ${
                isStart
                  ? 'bg-[#00ff88]/80 text-slate-900'
                  : isEnd
                  ? 'bg-[#ff4d4d]/80 text-white'
                  : isPath
                  ? 'bg-[#ffd700]/80 text-slate-900'
                  : 'bg-white/5 text-slate-200'
              }`}
              title={`Visit ${idx + 1}: ${nodeLabel(key)}`}
            >
              <span className="text-[10px] text-slate-300">{idx + 1}</span>
              <span className="font-semibold">{nodeLabel(key)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PathTimeline;
