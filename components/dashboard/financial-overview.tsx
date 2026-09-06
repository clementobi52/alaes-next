import { FileText, Receipt, LineChart } from 'lucide-react'
import { FINANCE } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

export function FinancialOverview() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-1/15 text-chart-1">
          <LineChart className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-semibold">Financial Overview</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {FINANCE.map((item) => {
          const isBill = item.kind === 'bill'
          return (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-background/40 p-4"
            >
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                {isBill ? (
                  <FileText className="h-4 w-4 text-chart-5" />
                ) : (
                  <Receipt className="h-4 w-4 text-chart-1" />
                )}
                <span>{item.title}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{item.amount}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    isBill ? 'bg-destructive' : 'bg-chart-1',
                  )}
                />
                {item.detail}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
