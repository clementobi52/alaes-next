import { ONBOARDING, TASKS } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

export function OnboardingCard() {
  const done = TASKS.filter((t) => t.done).length
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Onboarding</h2>
          <span className="text-2xl font-bold text-chart-1">18%</span>
        </div>
        <div className="flex flex-col gap-4">
          {ONBOARDING.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-10 shrink-0 text-xs text-muted-foreground">
                {row.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-chart-1"
                  style={{ width: `${row.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Onboarding Task</h3>
          <span className="text-lg font-bold">
            {done}/{TASKS.length}
          </span>
        </div>
        <ul className="flex flex-col gap-3">
          {TASKS.map((t) => (
            <li
              key={t.title}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    t.done ? 'bg-chart-1' : 'bg-muted-foreground/40',
                  )}
                />
                <span
                  className={
                    t.done ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  {t.title}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">{t.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
