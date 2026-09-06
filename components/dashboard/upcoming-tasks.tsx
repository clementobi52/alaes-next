import { TASKS } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

export function UpcomingTasks() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold">Upcoming Tasks</h2>
      <ul className="flex flex-col gap-4">
        {TASKS.map((t) => (
          <li key={t.title} className="flex items-center gap-3">
            <span
              className={cn(
                'h-2.5 w-2.5 shrink-0 rounded-full',
                t.done ? 'bg-chart-1' : 'bg-muted-foreground/40',
              )}
            />
            <span
              className={cn(
                'flex-1 text-sm font-medium',
                t.done ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {t.title}
            </span>
            <span className="text-xs text-muted-foreground">{t.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
