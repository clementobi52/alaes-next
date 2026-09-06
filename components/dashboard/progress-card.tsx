import { ExternalLink } from 'lucide-react'
import { WORK_WEEK } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

export function ProgressCard() {
  const max = Math.max(...WORK_WEEK.map((d) => d.value))
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Progress</h2>
        <button
          type="button"
          aria-label="Open progress"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-6 flex items-end gap-2">
        <span className="text-4xl font-bold tracking-tight">
          6.1<span className="text-2xl">h</span>
        </span>
        <span className="pb-1 text-sm leading-tight text-muted-foreground">
          Work Time
          <br />
          this week
        </span>
      </div>

      <div className="flex flex-1 items-end justify-between gap-2">
        {WORK_WEEK.map((d, i) => {
          const isPeak = d.value === max
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-32 w-full items-end justify-center">
                {isPeak && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium">
                    5h 23m
                  </span>
                )}
                <div
                  className={cn(
                    'w-2.5 rounded-full',
                    isPeak ? 'bg-chart-1' : 'bg-muted',
                  )}
                  style={{ height: `${(d.value / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
