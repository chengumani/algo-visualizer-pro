const colorClass = {
  default: 'bg-sky-500/70',
  compare: 'bg-amber-400',
  swap: 'bg-rose-500',
  sorted: 'bg-emerald-500',
  pivot: 'bg-purple-500',
};

const Bar = ({ value, width, state = 'default', showValue }) => {
  const barClass = colorClass[state] ?? colorClass.default;
  return (
    <div
      className={`relative flex-1 h-full ${state === 'swap' ? 'bar-swap' : ''}`}
      style={{ minWidth: `${width}%` }}
    >
      <div
        className={`${barClass} rounded-sm transition-[height] duration-200 ease-out w-full h-full`}
        style={{ height: `${value}%` }}
      >
        {showValue && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-200 drop-shadow">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default Bar;
