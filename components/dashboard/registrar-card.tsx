import { MapPin, FileEdit, Clock, CheckCircle2, FolderClosed } from 'lucide-react'

const STATS = [
  { icon: FileEdit, label: 'Plots Processed Today', value: '12', tone: 'text-chart-1' },
  { icon: Clock, label: 'Pending Applications', value: '28', tone: 'text-chart-2' },
  { icon: CheckCircle2, label: 'Approved This Week', value: '47', tone: 'text-chart-3' },
  { icon: FolderClosed, label: 'Files Assigned', value: '156', tone: 'text-chart-4' },
]

export function RegistrarCard() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      <div className="relative overflow-hidden">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-chart-1/60 text-6xl font-bold text-primary-foreground">
          A
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold">Admin</h3>
        <p className="text-sm text-muted-foreground">Senior Land Registrar</p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium">
        <MapPin className="h-4 w-4 text-chart-1" />
        Greater Umuahia
      </div>

      <div className="flex flex-col gap-2">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3"
          >
            <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <s.icon className={`h-4 w-4 ${s.tone}`} />
              {s.label}
            </span>
            <span className="text-sm font-semibold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
