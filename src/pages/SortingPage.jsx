import { useEffect, useMemo, useRef, useState } from 'react';
import { bubbleSort } from '../algorithms/sorting/bubbleSort';
import { selectionSort } from '../algorithms/sorting/selectionSort';
import { insertionSort } from '../algorithms/sorting/insertionSort';
import { mergeSort } from '../algorithms/sorting/mergeSort';
import { quickSort } from '../algorithms/sorting/quickSort';
import { generateRandomArray } from '../utils/arrays';
import { sleep } from '../utils/delay';

const algorithmMap = {
  merge: { label: 'Merge Sort', fn: mergeSort },
  quick: { label: 'Quick Sort', fn: quickSort },
  insertion: { label: 'Insertion Sort', fn: insertionSort },
  selection: { label: 'Selection Sort', fn: selectionSort },
  bubble: { label: 'Bubble Sort', fn: bubbleSort },
};

const SortingPage = () => {
  const [array, setArray] = useState(() => generateRandomArray(40));
  const baseArrayRef = useRef(array);
  const [size, setSize] = useState(40);
  const [speed, setSpeed] = useState(55);
  const [algorithm, setAlgorithm] = useState('merge');
  const [explanation, setExplanation] = useState('Ready to visualize. Choose an algorithm and hit Play.');
  const [activeIndices, setActiveIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const stepsRef = useRef([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(false);

  const delay = useMemo(() => Math.max(20, 520 - speed * 5), [speed]);
  const barWidth = useMemo(() => Math.max(2, Math.floor(100 / array.length)), [array.length]);

  const resetVisualState = () => {
    setActiveIndices([]);
    setSwapIndices([]);
    setSortedIndices(new Set());
    setCurrentStep(0);
    playRef.current = false;
    setIsPlaying(false);
  };

  const buildSteps = (sourceArray = array, chosenAlgorithm = algorithm) => {
    const fn = algorithmMap[chosenAlgorithm].fn;
    const newSteps = fn([...sourceArray]);
    stepsRef.current = newSteps;
    setExplanation(`${algorithmMap[chosenAlgorithm].label} ready with ${newSteps.length} steps.`);
    setArray([...sourceArray]);
    resetVisualState();
  };

  useEffect(() => {
    const newArr = generateRandomArray(size);
    baseArrayRef.current = newArr;
    setArray(newArr);
    buildSteps(newArr, algorithm);
  }, [size, algorithm]);

  const getBarColor = (index) => {
    if (sortedIndices.has(index)) return 'bg-aurora';
    if (swapIndices.includes(index)) return 'bg-ember';
    if (activeIndices.includes(index)) return 'bg-amber';
    return 'bg-white/30';
  };

  const applyStep = (step) => {
    const { type, indices = [], value, message } = step;
    setExplanation(message);
    setActiveIndices([]);
    setSwapIndices([]);

    if (type === 'compare' || type === 'pivot') {
      setActiveIndices(indices);
    }
    if (type === 'swap') {
      setSwapIndices(indices);
      setArray((prev) => {
        const copy = [...prev];
        const [i, j] = indices;
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
      });
    }
    if (type === 'overwrite') {
      const [i] = indices;
      setArray((prev) => {
        const copy = [...prev];
        copy[i] = value;
        return copy;
      });
    }
    if (type === 'markSorted') {
      setSortedIndices((prev) => new Set([...prev, ...indices]));
    }
  };

  const playFrom = async (startIndex = 0) => {
    if (!stepsRef.current.length) {
      buildSteps(baseArrayRef.current, algorithm);
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
      await sleep(delay);
    }
    setIsPlaying(false);
    playRef.current = false;
    setExplanation('Sorted! Every element locked in green.');
  };

  const handlePlay = () => {
    resetVisualState();
    setArray([...baseArrayRef.current]);
    buildSteps(baseArrayRef.current, algorithm);
    playFrom(0);
  };

  const handleResume = () => {
    if (currentStep >= stepsRef.current.length) return;
    playFrom(currentStep);
  };

  const handlePause = () => {
    playRef.current = false;
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (!stepsRef.current.length) {
      buildSteps(baseArrayRef.current, algorithm);
    }
    if (currentStep >= stepsRef.current.length) return;
    applyStep(stepsRef.current[currentStep]);
    setCurrentStep((prev) => prev + 1);
  };

  const handleReset = () => {
    playRef.current = false;
    setArray([...baseArrayRef.current]);
    resetVisualState();
    setExplanation('Reset to the unsorted array.');
  };

  const handleGenerate = () => {
    const fresh = generateRandomArray(size);
    baseArrayRef.current = fresh;
    setArray(fresh);
    buildSteps(fresh, algorithm);
  };

  const controlButton = (label, action, variant = 'ghost', disabled = false) => (
    <button
      onClick={action}
      disabled={disabled}
      className={
        variant === 'primary'
          ? 'btn-primary text-sm'
          : 'btn-ghost text-sm disabled:opacity-60 disabled:cursor-not-allowed'
      }
    >
      {label}
    </button>
  );

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="pill mb-2">Sorting Visualizer</div>
          <h2 className="section-title">Watch classic sorts animate in real time</h2>
          <p className="subtext">Color legend: yellow = comparing, red = swapping/writing, green = sorted.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {controlButton(isPlaying ? 'Pause' : 'Play', isPlaying ? handlePause : handlePlay, 'primary')}
          {controlButton('Resume', handleResume, 'ghost', isPlaying)}
          {controlButton('Step', handleStep, 'ghost', isPlaying)}
          {controlButton('Reset', handleReset, 'ghost')}
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
                buildSteps(baseArrayRef.current, e.target.value);
              }}
              className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon/70"
            >
              {Object.entries(algorithmMap).map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.label}
                </option>
              ))}
            </select>
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
            <p className="control-label">Array Size ({size} items)</p>
            <input
              type="range"
              min={8}
              max={120}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button className="btn-ghost w-full" onClick={handleGenerate} disabled={isPlaying}>
            New random array
          </button>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-4 border border-white/5">
            <p className="text-sm text-slate-300 mb-3 min-h-[24px]">{explanation}</p>
            <div className="relative h-64 md:h-72 flex items-end justify-center bg-white/5 rounded-xl p-3 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="flex items-end gap-[2px] w-full h-full">
                {array.map((value, idx) => (
                  <div
                    key={idx}
                    className={`${getBarColor(idx)} rounded-sm transition-all duration-150 ease-out flex-1`}
                    style={{ height: `${value}%`, minWidth: `${barWidth}%` }}
                    title={`Index ${idx}: ${value}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Step {currentStep} / {stepsRef.current.length}
            </span>
            <span>Pause/Resume + Step mode supported</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SortingPage;
