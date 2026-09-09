'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FilePlus,
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PrimaryApplicationForm } from '@/components/sectional-titling/primary-application-form'
import {
  SectionCard,
  SectionHeader,
  StatusBadge,
  Avatar,
} from '@/components/system-admin/primitives'
import {
  PRIMARY_STATS,
  PRIMARY_APPLICATIONS,
  statusTone,
  landUseTone,
  type ApprovalStage,
} from '@/lib/sectional-titling-data'

const OVERVIEW_CARDS = [
  { label: 'Total Applications', value: PRIMARY_STATS.total, tag: 'All Records', tone: 'neutral' as const, icon: FileText },
  { label: 'Approved', value: PRIMARY_STATS.approved, tag: 'Completed', tone: 'green' as const, icon: CheckCircle2 },
  { label: 'Declined Applications', value: PRIMARY_STATS.declined, tag: 'Declined', tone: 'red' as const, icon: XCircle },
  { label: 'Pending', value: PRIMARY_STATS.pending, tag: 'In Review', tone: 'amber' as const, icon: Clock },
]

const CARD_ACCENT: Record<string, string> = {
  neutral: 'text-muted-foreground',
  green: 'text-primary',
  red: 'text-destructive',
  amber: 'text-chart-4',
}

function StageCell({ stage }: { stage: ApprovalStage }) {
  return (
    <div className="flex flex-col gap-1">
      <StatusBadge tone={statusTone(stage.status)} dot={false}>
        {stage.status}
      </StatusBadge>
      {stage.date && (
        <span className="text-[10px] text-muted-foreground">{stage.date}</span>
      )}
    </div>
  )
}

export default function PrimaryApplicationsPage() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applications, setApplications] = useState(PRIMARY_APPLICATIONS)
  const pageSize = 10

  useEffect(() => {
    fetch('/api/sectional-titling/primary-applications')
      .then((response) => response.json())
      .then((payload) => { if (payload.ok && payload.applications.length) setApplications(payload.applications) })
      .catch(() => undefined)
  }, [])

  const filtered = useMemo(() => applications.filter((a) => {
    const matchesStatus = !status || a.directorApproval.status === status
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [a.stFileNo, a.mlsFileNo, a.property, a.type, a.landUse, a.owner].some((value) => value.toLowerCase().includes(query))
    return matchesStatus && matchesSearch
  }), [status, search, applications])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleApplications = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AppShell
      title="Primary Applications"
      subtitle="Applications from original property owners to initiate sectional titling."
      metrics={[]}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground"><option value="">All...</option><option>Approved</option><option>Pending</option><option>Declined</option></select>
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground"><Download className="size-4" />Export<ChevronDown className="size-3" /></button>
          <button type="button" onClick={() => setShowApplicationForm(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground"><FilePlus className="size-4" />New Primary Application<ChevronDown className="size-3" /></button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2"><button type="button" className="rounded-sm border border-border bg-muted px-3 py-2 text-xs">Excel</button><button type="button" className="rounded-sm border border-border bg-muted px-3 py-2 text-xs">CSV</button><button type="button" className="rounded-sm border border-border bg-muted px-3 py-2 text-xs">PDF</button></div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">Search:<input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="h-9 rounded-md border border-border bg-card px-3 text-foreground" /></label>
        </div>
        {/* Overview cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {OVERVIEW_CARDS.map((c) => (
            <SectionCard key={c.label} className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{c.label}</h3>
                <c.icon className={`h-5 w-5 ${CARD_ACCENT[c.tone]}`} />
              </div>
              <div className={`mt-3 text-3xl font-bold tracking-tight ${CARD_ACCENT[c.tone]}`}>
                {c.value}
              </div>
              <div className="mt-3">
                <StatusBadge tone={c.tone} dot={false}>
                  {c.tag}
                </StatusBadge>
              </div>
            </SectionCard>
          ))}
        </div>

        {/* Table */}
        <SectionCard>
          <SectionHeader title="Primary Applications" description="Track each application through the approval pipeline" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">ST FileNo</th>
                  <th className="px-4 py-3 font-medium">MLSFileNo</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Land Use</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 text-center font-medium">Units</th>
                  <th className="px-4 py-3 font-medium">App Date</th>
                  <th className="px-4 py-3 font-medium">JSI Status</th>
                  <th className="px-4 py-3 font-medium">JSI Approval</th>
                  <th className="px-4 py-3 font-medium">Planning</th>
                  <th className="px-4 py-3 font-medium">Director</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((a) => (
                  <tr
                    key={a.stFileNo}
                    className="border-b border-border/60 last:border-0 align-top transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{a.stFileNo}</div>
                      <div className="text-xs text-muted-foreground">{a.mlsFileNo}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.mlsFileNo}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-[180px] truncate" title={a.property}>
                        {a.property}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.type}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={landUseTone(a.landUse)} dot={false}>
                        {a.landUse}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {a.passport ? <img src={a.passport} alt={`${a.owner} passport`} className="size-8 rounded-full object-cover" /> : <Avatar name={a.owner} />}
                        <span className="max-w-[120px] truncate">{a.owner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {a.units?.allocated ?? 0} of {a.units?.total ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.applicationDate}</td>
                    <td className="px-4 py-3">
                      <StageCell stage={a.jsiStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StageCell stage={a.jsiApproval} />
                    </td>
                    <td className="px-4 py-3">
                      <StageCell stage={a.planningRecommendation} />
                    </td>
                    <td className="px-4 py-3">
                      <StageCell stage={a.directorApproval} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        aria-label={`View ${a.stFileNo}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">
                      No applications match the selected status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground"><span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries</span><div className="flex items-center gap-1"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-md px-2 py-1 hover:bg-muted disabled:opacity-40"><ChevronLeft className="size-4" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button type="button" key={item} onClick={() => setPage(item)} className={`rounded-md px-3 py-1 ${item === page ? 'bg-muted font-semibold text-foreground' : 'hover:bg-muted'}`}>{item}</button>)}<button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="rounded-md px-2 py-1 hover:bg-muted disabled:opacity-40"><ChevronRight className="size-4" /></button></div></div>
        </SectionCard>
      </div>
      {showApplicationForm && <PrimaryApplicationForm onClose={() => setShowApplicationForm(false)} />}
    </AppShell>
  )
}
