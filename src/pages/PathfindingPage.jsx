import { useMemo, useRef, useState } from 'react';
import { astar } from '../algorithms/pathfinding/astar';
import { bfs } from '../algorithms/pathfinding/bfs';
import { dfs } from '../algorithms/pathfinding/dfs';
import { dijkstra } from '../algorithms/pathfinding/dijkstra';
import { keyOf } from '../algorithms/pathfinding/common';
import { sleep } from '../utils/delay';
import Grid from '../components/Grid';

const algorithms = {
  astar: { label: 'A* (fast & optimal)', fn: astar },
  dijkstra: { label: "Dijkstra's", fn: dijkstra },
  bfs: { label: 'Breadth-First Search', fn: bfs },
  dfs: { label: 'Depth-First Search', fn: dfs },
};

const scenarios = {
  empty: { label: 'Open grid (no walls)', density: 0 },
  sparse: { label: 'Random obstacles (light)', density: 0.12 },
  maze: { label: 'Simple corridor maze', density: 'maze' },
};

const rows = 18;
const cols = 32;

const PathfindingPage = () => {
  const [walls, setWalls] = useState(new Set());
  const [visited, setVisited] = useState(new Set());
  const [frontier, setFrontier] = useState(new Set());
  const [path, setPath] = useState(new Set());
  const [start, setStart] = useState({ row: 8, col: 6 });
  const [end, setEnd] = useState({ row: 10, col: 24 });
  const [algorithm, setAlgorithm] = useState('astar');
  const [mode, setMode] = useState('wall');
  const [scenario, setScenario] = useState('empty');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawMode, setDrawMode] = useState('add');
  const [speed, setSpeed] = useState(55);
  const [explanation, setExplanation] = useState('Click to draw walls, set start/end, then visualize.');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stepsRef = useRef([]);
  const playRef = useRef(false);

  const delay = useMemo(() => Math.max(30, 520 - speed * 5), [speed]);

  const resetTraversal = () => {
    setVisited(new Set());
    setFrontier(new Set());
    setPath(new Set());
    stepsRef.current = [];
    setCurrentStep(0);
    setExplanation('Grid cleared. Draw and run again.');
    playRef.current = false;
    setIsPlaying(false);
  };

  const toggleWall = (row, col, forceMode = null) => {
    const key = keyOf({ row, col });
    if (key === keyOf(start) || key === keyOf(end)) return;
    setWalls((prev) => {
      const next = new Set(prev);
      const shouldAdd = forceMode ? forceMode === 'add' : !next.has(key);
      if (shouldAdd) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const applyStep = (step) => {
    if (!step) return;
    const { type, node, message } = step;
    const key = keyOf(node);
    if (type === 'visit') {
      setVisited((prev) => new Set(prev).add(key));
      setExplanation(message);
    }
    if (type === 'frontier') {
      setFrontier((prev) => new Set(prev).add(key));
      setExplanation(message);
    }
    if (type === 'path') {
      setPath((prev) => new Set(prev).add(key));
      setExplanation('Shortest path traced.');
    }
  };

  const generateScenarioWalls = (type) => {
    if (type === 'empty') return new Set();
    if (type === 'maze') {
      const next = new Set();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r % 2 === 0 && c % 4 === 0) next.add(keyOf({ row: r, col: c }));
          if (c === Math.floor(cols / 2) && r % 3 === 1) next.add(keyOf({ row: r, col: c }));
        }
      }
      return next;
    }
    // sparse random
    const density = scenarios[type]?.density ?? 0.1;
    const next = new Set();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = keyOf({ row: r, col: c });
        if (Math.random() < density && key !== keyOf(start) && key !== keyOf(end)) {
          next.add(key);
        }
      }
    }
    return next;
  };

  const runAlgorithm = async (startIndex = 0) => {
    if (keyOf(start) === keyOf(end)) {
      setExplanation('Choose different start and end nodes.');
      return;
    }
    if (!stepsRef.current.length) {
      const fn = algorithms[algorithm].fn;
      const steps = fn(rows, cols, walls, start, end);
      stepsRef.current = steps;
      setExplanation(`${algorithms[algorithm].label} generated ${steps.length} steps.`);
    }
    playRef.current = true;
    setIsPlaying(true);
    for (let i = startIndex; i < stepsRef.current.length; i++) {
      if (!playRef.current) {
        setCurrentStep(i);
        setIsPlaying(false);
        return;
      }
      applyStep(stepsRef.current[i]);
      setCurrentStep(i + 1);
      const stepDelay = stepsRef.current[i].type === 'path' ? 28 : delay;
      await sleep(stepDelay);
    }
    setIsPlaying(false);
    playRef.current = false;
  };

  const handlePlay = () => {
    setVisited(new Set());
    setFrontier(new Set());
    setPath(new Set());
    stepsRef.current = [];
    runAlgorithm(0);
  };

  const handleScenario = (value) => {
    setScenario(value);
    const nextWalls = generateScenarioWalls(value);
    setWalls(nextWalls);
    resetTraversal();
    setExplanation(`Loaded scenario: ${scenarios[value].label}`);
  };

  const handlePause = () => {
    playRef.current = false;
    setIsPlaying(false);
  };

  const handleResume = () => {
    if (currentStep >= stepsRef.current.length) return;
    runAlgorithm(currentStep);
  };

  const handleStep = () => {
    if (!stepsRef.current.length) {
      const fn = algorithms[algorithm].fn;
      stepsRef.current = fn(rows, cols, walls, start, end);
    }
    if (currentStep >= stepsRef.current.length) return;
    applyStep(stepsRef.current[currentStep]);
    setCurrentStep((prev) => prev + 1);
  };

  const handleCellDown = (row, col) => {
    setIsMouseDown(true);
    if (mode === 'start') {
      setStart({ row, col });
      resetTraversal();
      return;
    }
    if (mode === 'end') {
      setEnd({ row, col });
      resetTraversal();
      return;
    }
    const key = keyOf({ row, col });
    const shouldAdd = !walls.has(key);
    setDrawMode(shouldAdd ? 'add' : 'remove');
    toggleWall(row, col, shouldAdd ? 'add' : 'remove');
  };

  const handleCellEnter = (row, col) => {
    if (!isMouseDown || mode !== 'wall') return;
    toggleWall(row, col, drawMode);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  return (
    <section className="space-y-6" onMouseUp={handleMouseUp}>
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="pill mb-2">Pathfinding Visualizer</div>
          <h2 className="section-title">See how graphs are explored step by step</h2>
          <p className="subtext">Visited nodes appear in blue haze, final path in green, walls in deep slate.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-primary text-sm" onClick={isPlaying ? handlePause : handlePlay}>
            {isPlaying ? 'Pause' : 'Visualize'}
          </button>
          <button className="btn-ghost text-sm" onClick={handleResume} disabled={isPlaying}>
            Resume
          </button>
          <button className="btn-ghost text-sm" onClick={handleStep} disabled={isPlaying}>
            Step
          </button>
          <button className="btn-ghost text-sm" onClick={resetTraversal}>
            Reset
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 grid lg:grid-cols-[280px,1fr] gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="control-label">Algorithm</p>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                resetTraversal();
              }}
              className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon/70"
            >
              {Object.entries(algorithms).map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="control-label">Scenario</p>
            <select
              value={scenario}
              onChange={(e) => handleScenario(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon/70"
            >
              {Object.entries(scenarios).map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-300">Pick a preset layout to avoid hand-drawing walls.</p>
          </div>

          <div className="space-y-2">
            <p className="control-label">Speed ({Math.round(delay)} ms)</p>
            <input
              type="range"
              min={1}
              max={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <p className="control-label">Placement Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {['wall', 'start', 'end'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-2 rounded-lg text-sm border border-white/10 ${
                    mode === m ? 'bg-white/10 text-white' : 'text-slate-200'
                  }`}
                >
                  {m === 'wall' ? 'Walls' : m === 'start' ? 'Start' : 'End'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="control-label">Grid Actions</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-ghost text-sm" onClick={() => setWalls(new Set())}>
                Clear walls
              </button>
              <button className="btn-ghost text-sm" onClick={resetTraversal}>
                Clear visited
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-300 mb-1 min-h-[24px]">{explanation}</p>
          <Grid
            rows={rows}
            cols={cols}
            startKey={keyOf(start)}
            endKey={keyOf(end)}
            path={path}
            visited={visited}
            frontier={frontier}
            walls={walls}
            onCellDown={handleCellDown}
            onCellEnter={handleCellEnter}
            onMouseUp={handleMouseUp}
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Step {currentStep} / {stepsRef.current.length}
            </span>
            <span>Drag to draw walls • Click Start/End mode to reposition</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathfindingPage;
