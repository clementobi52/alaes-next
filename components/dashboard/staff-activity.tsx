import { STAFF } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
}

export function StaffActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold">Staff Activity</h2>
      <ul className="flex flex-col gap-4">
        {STAFF.map((s) => (
          <li key={s.name} className="flex items-center gap-3">
            <span
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                s.color,
              )}
            >
              {initials(s.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{s.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                <span
                  className={
                    s.state === 'active' ? 'text-chart-1' : 'text-chart-2'
                  }
                >
                  {s.status}
                </span>{' '}
                &bull; {s.activity}
              </p>
            </div>
            <span
              className={cn(
                'h-2.5 w-2.5 shrink-0 rounded-full',
                s.state === 'active' ? 'bg-chart-1' : 'bg-chart-2',
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
