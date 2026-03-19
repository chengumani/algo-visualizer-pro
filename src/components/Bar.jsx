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
        className={`${barClass} rounded-sm transition-[height] duration-200 ease-out w-full absolute bottom-0`}
        style={{ height: `${value}%` }}
      />
      {showValue && (
        <span
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white drop-shadow"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.65)' }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default Bar;
