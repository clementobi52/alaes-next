import { FileText } from 'lucide-react'
import { PENDING_FILES } from '@/lib/dashboard-data'

export function PendingFiles() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pending Files</h2>
        <span className="rounded-full bg-chart-2/15 px-2.5 py-1 text-xs font-semibold text-chart-2">
          {PENDING_FILES.length} files
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {PENDING_FILES.map((f) => (
          <li key={f.fileNo} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <FileText className={`h-5 w-5 ${f.tone}`} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{f.fileNo}</p>
              <p className="truncate text-xs text-muted-foreground">{f.task}</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-chart-2">
              {f.age}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
