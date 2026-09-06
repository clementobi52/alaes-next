'use client'

import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Download, XCircle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  SearchBar,
  SectionCard,
  SectionHeader,
  SelectInput,
  StatTile,
  StatusBadge,
  type Tone,
} from '@/components/system-admin/primitives'
import { ACTIVITY_LOGS, type LogStatus } from '@/lib/system-admin-data'

const STATUS_TONE: Record<LogStatus, Tone> = {
  success: 'green',
  failed: 'red',
  warning: 'amber',
}
const PAGE_SIZE = 8

export default function ActivityLogsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [module, setModule] = useState('all')
  const [page, setPage] = useState(1)

  const modules = useMemo(
    () => Array.from(new Set(ACTIVITY_LOGS.map((l) => l.module))).sort(),
    [],
  )

  const filtered = useMemo(
    () =>
      ACTIVITY_LOGS.filter((l) => {
        const q = query.toLowerCase()
        const matchesQuery =
          !q ||
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.ip.includes(q)
        const matchesStatus = status === 'all' || l.status === status
        const matchesModule = module === 'all' || l.module === module
        return matchesQuery && matchesStatus && matchesModule
      }),
    [query, status, module],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const stats = useMemo(
    () => ({
      total: ACTIVITY_LOGS.length,
      success: ACTIVITY_LOGS.filter((l) => l.status === 'success').length,
      failed: ACTIVITY_LOGS.filter((l) => l.status === 'failed').length,
      warning: ACTIVITY_LOGS.filter((l) => l.status === 'warning').length,
    }),
    [],
  )

  function exportCsv() {
    const header = 'Time,User,Action,Module,IP,Status\n'
    const body = filtered
      .map((l) => `"${l.time}","${l.user}","${l.action}","${l.module}","${l.ip}","${l.status}"`)
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alaes-activity-logs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell
      title="Activity Logs"
      subtitle="A full audit trail of every action across ALAES."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatTile icon={Activity} label="Total events" value={stats.total} tone="blue" />
          <StatTile icon={CheckCircle2} label="Successful" value={stats.success} tone="green" />
          <StatTile icon={AlertTriangle} label="Warnings" value={stats.warning} tone="amber" />
          <StatTile icon={XCircle} label="Failed / blocked" value={stats.failed} tone="red" />
        </div>

        <SectionCard>
          <SectionHeader
            title="Audit trail"
            description={`${filtered.length} matching events`}
            actions={
              <Button variant="outline" onClick={exportCsv}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            }
          />

          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center">
            <SearchBar
              value={query}
              onChange={(v) => {
                setQuery(v)
                setPage(1)
              }}
              placeholder="Search user, action or IP…"
              className="lg:max-w-sm lg:flex-1"
            />
            <div className="flex gap-3">
              <SelectInput
                value={module}
                onChange={(e) => {
                  setModule(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">All modules</option>
                {modules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </SelectInput>
              <SelectInput
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">All statuses</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="failed">Failed</option>
              </SelectInput>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Timestamp</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Module</th>
                  <th className="px-5 py-3 font-medium">IP address</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((l) => (
                  <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{l.time}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={l.user} className="h-7 w-7 text-[10px]" />
                        <span className="font-medium text-foreground">{l.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground">{l.action}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.module}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={STATUS_TONE[l.status]}>
                        {l.status[0].toUpperCase() + l.status.slice(1)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                      No events match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-5">
            <p className="text-sm text-muted-foreground">
              Page {current} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={current >= totalPages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}
