import { cn } from '@/lib/utils'

export function AlaesLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className="relative inline-block h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-chart-5" />
        <span className="absolute right-0 top-0.5 h-4 w-4 rounded-full bg-chart-1" />
        <span className="absolute bottom-0 left-1.5 h-4 w-4 rounded-full bg-chart-2" />
        <span className="absolute bottom-0.5 right-1 h-3.5 w-3.5 rounded-full bg-chart-1/80" />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive" />
      </span>
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-chart-1">AL</span>
        <span className="text-chart-2">A</span>
        <span className="text-foreground">ES</span>
      </span>
    </div>
  )
}
