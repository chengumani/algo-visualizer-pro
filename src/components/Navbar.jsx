const tabs = [
  { id: 'sorting', label: 'Sorting Lab' },
  { id: 'path', label: 'Pathfinding Lab' },
];

const Navbar = ({ active, onChange }) => (
  <header className="sticky top-0 z-20 backdrop-blur-xl bg-ink/70 border-b border-white/5">
    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon to-sky-500 flex items-center justify-center text-ink font-black text-lg shadow-lg">
          AV
        </span>
        <div>
          <p className="text-sm text-slate-300 uppercase tracking-[0.16em]">Algo Visualizer Pro</p>
          <p className="text-white font-semibold text-lg">Interactive CS playground</p>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border border-white/10 ${
              active === tab.id
                ? 'bg-gradient-to-r from-neon to-sky-500 text-ink shadow-lg'
                : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

export default Navbar;
