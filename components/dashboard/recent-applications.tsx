import { MapPin, CheckCircle2, Clock, Loader } from 'lucide-react'
import { APPLICATIONS, type Application } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

const STATUS: Record<
  Application['status'],
  { icon: typeof CheckCircle2; badge: string; bar: string }
> = {
  Approved: {
    icon: CheckCircle2,
    badge: 'bg-chart-1/15 text-chart-1',
    bar: 'bg-chart-1',
  },
  Pending: {
    icon: Clock,
    badge: 'bg-chart-2/15 text-chart-2',
    bar: 'bg-chart-2',
  },
  Processing: {
    icon: Loader,
    badge: 'bg-chart-3/15 text-chart-3',
    bar: 'bg-chart-3',
  },
}

export function RecentApplications() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Land Applications</h2>
        <button
          type="button"
          className="text-sm font-medium text-chart-1 transition-colors hover:text-chart-1/80"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {APPLICATIONS.map((app) => {
          const s = STATUS[app.status]
          return (
            <article
              key={app.fileNo}
              className="flex flex-col rounded-xl border border-border bg-background/40 p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                    s.badge,
                  )}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {app.status}
                </span>
                <span className="text-xs text-muted-foreground">{app.when}</span>
              </div>

              <h3 className="text-base font-semibold">{app.type}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                File No: {app.fileNo}
              </p>

              <div className="mt-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {app.initials}
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {app.applicant}
                  </p>
                  <p className="text-xs text-muted-foreground">Applicant</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-chart-1" />
                {app.location}
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', s.bar)}
                  style={{ width: `${app.progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">{app.sqm}</span>
                <span className="text-lg font-bold">{app.price}</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
