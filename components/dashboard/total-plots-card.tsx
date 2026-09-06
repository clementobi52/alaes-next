import { ArrowUp } from 'lucide-react'

export function TotalPlotsCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-chart-1 to-chart-1/70 p-6 text-primary-foreground">
      <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <p className="relative text-5xl font-bold tracking-tight">4,297</p>
      <p className="relative mt-2 text-base font-medium opacity-90">
        Total Registered Plots
      </p>
      <div className="relative mt-4 flex items-center gap-1.5 text-sm font-medium opacity-90">
        <ArrowUp className="h-4 w-4" />
        +12% this month
      </div>
    </div>
  )
}
