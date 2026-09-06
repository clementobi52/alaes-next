import { ExternalLink } from 'lucide-react'

export function TimeTracker() {
  const pct = 68
  const r = 70
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Time tracker</h2>
        <button
          type="button"
          aria-label="Open time tracker"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center py-4">
        <div className="relative h-44 w-44">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="10"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke="var(--chart-2)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight">02:35</span>
            <span className="text-sm text-muted-foreground">Work Time</span>
          </div>
        </div>
      </div>
    </div>
  )
}
