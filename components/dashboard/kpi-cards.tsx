import { ArrowUp, Minus } from 'lucide-react'
import { KPIS, type Kpi } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

const TONE: Record<Kpi['tone'], { icon: string; bar: string }> = {
  green: { icon: 'bg-chart-1 text-primary-foreground', bar: 'bg-chart-1' },
  teal: { icon: 'bg-chart-1/70 text-primary-foreground', bar: 'bg-chart-1/70' },
  blue: { icon: 'bg-chart-3 text-white', bar: 'bg-chart-3' },
  pink: { icon: 'bg-chart-5 text-white', bar: 'bg-chart-5' },
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi) => {
        const tone = TONE[kpi.tone]
        return (
          <div
            key={kpi.label}
            className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl',
                  tone.icon,
                )}
              >
                <kpi.icon className="h-6 w-6" />
              </span>
              <span
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                  kpi.trend === 'up'
                    ? 'bg-chart-1/15 text-chart-1'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {kpi.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {kpi.delta}
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight">{kpi.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', tone.bar)}
                style={{ width: `${kpi.progress}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
