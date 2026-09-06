'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { LineChart } from 'lucide-react'
import { REVENUE_TREND } from '@/lib/dashboard-data'

export function RevenueTrend() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-1/15 text-chart-1">
            <LineChart className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold">Revenue Trend</h2>
        </div>
        <span className="rounded-full bg-chart-1/15 px-2.5 py-1 text-xs font-semibold text-chart-1">
          +12.5%
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={REVENUE_TREND}
            margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis hide domain={[0, 80]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#revFill)"
              dot={{ r: 4, fill: 'var(--chart-1)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
