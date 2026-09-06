'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { LAND_DISTRIBUTION } from '@/lib/dashboard-data'

export function LandDistribution() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/15 text-chart-2">
            <PieIcon className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold">Land Distribution</h2>
        </div>
        <span className="text-sm text-muted-foreground">All Zones</span>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={LAND_DISTRIBUTION}
                dataKey="value"
                innerRadius={60}
                outerRadius={82}
                paddingAngle={2}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {LAND_DISTRIBUTION.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">2.5k</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Total Plots
            </span>
          </div>
        </div>

        <ul className="flex flex-1 flex-col gap-3">
          {LAND_DISTRIBUTION.map((d) => (
            <li key={d.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2.5 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                {d.name}
              </span>
              <span className="text-sm font-semibold">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
