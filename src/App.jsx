import { useState } from 'react';
import Navbar from './components/Navbar';
import PathfindingPage from './pages/PathfindingPage';
import SortingPage from './pages/SortingPage';

const heroCards = [
  {
    title: 'Step-by-step animations',
    body: 'Async engines keep the UI responsive. Pause, resume, or step through each comparison and visit.',
  },
  {
    title: 'Educator friendly',
    body: 'Inline narration surfaces the algorithm’s current intent — comparing, swapping, exploring, or locking nodes.',
  },
  {
    title: 'Portfolio ready',
    body: 'Modern dark UI, glass panels, and responsive layout designed to shine on desktop and mobile.',
  },
];

function App() {
  const [view, setView] = useState('sorting');

  return (
    <div className="min-h-screen">
      <Navbar active={view} onChange={setView} />

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        <section className="pt-10 grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-center">
          <div className="space-y-4">
            <div className="pill">CS Algorithms · Visual mode</div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-white leading-tight">
              Algorithm Visualizer Pro
            </h1>
            <p className="subtext md:text-lg">
              Explore how classic algorithms behave under the hood. Animate sorting on dynamic arrays or trace
              shortest paths on an interactive grid — all in the browser, no backend required.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                className="btn-primary"
                onClick={() => setView('sorting')}
              >
                Start with sorting
              </button>
              <button
                className="btn-ghost"
                onClick={() => setView('path')}
              >
                Jump to pathfinding
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            {heroCards.map((card) => (
              <div key={card.title} className="glass-panel p-4 border border-white/5">
                <p className="text-sm text-neon uppercase tracking-[0.14em] mb-1">{card.title}</p>
                <p className="text-sm text-slate-200">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {view === 'sorting' ? <SortingPage /> : <PathfindingPage />}
      </main>
    </div>
  );
}

export default App;
