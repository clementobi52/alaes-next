'use client'

import { useEffect, useState } from 'react'
import { Activity, Gauge, Radio, Users, Smartphone, Monitor } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import {
  Avatar,
  SectionCard,
  SectionHeader,
  StatTile,
  StatusBadge,
} from '@/components/system-admin/primitives'
import { LIVE_SESSIONS, ACTIVITY_LOGS, type LiveSession } from '@/lib/system-admin-data'
import { cn } from '@/lib/utils'

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

export default function ActivityMonitoringPage() {
  const [sessions, setSessions] = useState<LiveSession[]>(LIVE_SESSIONS)
  const [requestsPerMin, setRequestsPerMin] = useState(342)
  const [feed, setFeed] = useState(ACTIVITY_LOGS.slice(0, 6))

  // Simulate a live console: sessions age, load fluctuates, feed scrolls.
  useEffect(() => {
    const id = setInterval(() => {
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          minutes: s.minutes + 1,
          status: Math.random() > 0.85 ? (s.status === 'active' ? 'idle' : 'active') : s.status,
        })),
      )
      setRequestsPerMin(() => 280 + Math.floor(Math.random() * 160))
      setFeed((prev) => {
        const pool = ACTIVITY_LOGS
        const next = pool[Math.floor(Math.random() * pool.length)]
        return [{ ...next, id: `${next.id}-${Date.now()}` }, ...prev].slice(0, 6)
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const activeCount = sessions.filter((s) => s.status === 'active').length
  const avgResponse = 120 + (requestsPerMin % 40)

  return (
    <AppShell
      title="Activity Monitoring"
      subtitle="Live view of who is online and what the system is doing."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatTile
            icon={Users}
            label="Online users"
            value={sessions.length}
            tone="green"
            hint={`${activeCount} active now`}
          />
          <StatTile icon={Radio} label="Active sessions" value={activeCount} tone="blue" />
          <StatTile
            icon={Activity}
            label="Requests / min"
            value={requestsPerMin}
            tone="violet"
          />
          <StatTile
            icon={Gauge}
            label="Avg. response"
            value={`${avgResponse} ms`}
            tone="amber"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2">
            <SectionHeader
              title="Live sessions"
              description="Signed-in staff and their current module"
              actions={
                <span className="inline-flex items-center gap-2 text-xs font-medium text-chart-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
                  </span>
                  Live
                </span>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Module</th>
                    <th className="px-5 py-3 font-medium">Device</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.user} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{s.user}</p>
                            <p className="truncate text-xs text-muted-foreground">{s.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{s.module}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          {s.device.includes('Mobile') ? (
                            <Smartphone className="h-4 w-4" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                          {s.device}
                        </span>
                      </td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">
                        {formatDuration(s.minutes)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge tone={s.status === 'active' ? 'green' : 'amber'}>
                          {s.status === 'active' ? 'Active' : 'Idle'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader title="Live activity feed" />
            <ul className="flex flex-col">
              {feed.map((f, i) => (
                <li
                  key={f.id}
                  className={cn(
                    'flex items-start gap-3 px-5 py-3.5',
                    i === 0 && 'bg-muted/30',
                  )}
                >
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      f.status === 'success'
                        ? 'bg-chart-1'
                        : f.status === 'failed'
                          ? 'bg-destructive'
                          : 'bg-chart-2',
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground text-pretty">{f.action}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {f.user} · {f.module}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  )
}
