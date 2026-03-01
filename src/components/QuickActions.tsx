export function QuickActions() {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-6 relative overflow-hidden">
      {/* Geometric shapes decoration */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center">
        {/* Gold/Olive rotated square */}
        <div className="w-14 h-14 bg-amber-600/80 rotate-[-15deg] rounded-sm absolute -left-2 top-0" />
        {/* Dark blue square */}
        <div className="w-10 h-10 bg-slate-900 rotate-[10deg] rounded-sm absolute left-6 -top-4" />
        {/* Muted purple square */}
        <div className="w-8 h-8 bg-rose-900/60 rotate-[-5deg] rounded-sm absolute left-4 top-6" />
      </div>

      <div className="relative flex items-center justify-between gap-6 pl-24">
        {/* Left content */}
        <div className="flex-1">
          {/* Welcome label */}
          <span className="text-amber-400 text-sm font-medium mb-1 block">Welcome to</span>
          {/* Main title */}
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Strategic HR & Governance
          </h2>
          {/* Greeting text */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg">👋</span>
            <span className="text-white/90 font-medium">Good Afternoon, Super!</span>
            <span className="text-white/50 mx-1">·</span>
            <span className="text-sm text-white/70">
              You have <span className="text-amber-400 font-semibold">8 strategies</span> pending review
            </span>
          </div>
        </div>

        {/* Right badge */}
        <div className="relative">
          {/* Small circle decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/60 rounded-full" />
          <div className="bg-primary px-5 py-3 rounded-xl">
            <p className="text-xs text-primary-foreground/80">For Strategic</p>
            <p className="text-lg font-bold text-primary-foreground">Business Impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}
