'use client'

import { useState } from 'react'
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { STATS_HOURLY } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

const RANGES = ['Days', 'Weeks', 'Months'] as const
const DAYS = [
  ['01', 'Sat'], ['02', 'Sun'], ['03', 'Mon'], ['04', 'Tue'], ['05', 'Wed'],
  ['06', 'Thu'], ['07', 'Fri'], ['08', 'Sat'], ['09', 'Sun'], ['10', 'Mon'],
]

export function StatisticsChart() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('Weeks')
  const [day, setDay] = useState('10')

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Statistics</h2>
        <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                range === r
                  ? 'bg-chart-1 text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {DAYS.map(([num, name]) => (
          <button
            key={num}
            type="button"
            onClick={() => setDay(num)}
            className={cn(
              'flex flex-col items-center rounded-xl border py-2 transition-colors',
              day === num
                ? 'border-transparent bg-chart-1 text-primary-foreground'
                : 'border-border bg-background/40 text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="text-sm font-bold">{num}</span>
            <span className="text-[11px]">{name}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-[62%] rounded-full bg-chart-1" />
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={STATS_HOURLY}
            margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="statsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              interval={0}
              minTickGap={0}
            />
            <YAxis hide domain={[0, 100]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#statsFill)"
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="var(--chart-2)"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
