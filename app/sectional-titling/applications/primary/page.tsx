'use client'

import { useMemo, useState } from 'react'
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FilePlus,
  Eye,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import {
  SectionCard,
  SectionHeader,
  StatusBadge,
  Avatar,
  SelectInput,
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

  const filtered = useMemo(() => {
    if (!status) return PRIMARY_APPLICATIONS
    return PRIMARY_APPLICATIONS.filter((a) => a.directorApproval.status === status)
  }, [status])

  return (
    <AppShell
      title="Primary Applications"
      subtitle="Applications from original property owners to initiate sectional titling."
      metrics={[]}
    >
      <div className="space-y-6">
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
          <SectionHeader
            title="Primary Applications"
            description="Track each application through the approval pipeline"
            actions={
              <div className="flex items-center gap-2">
                <SelectInput
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 w-36"
                >
                  <option value="">All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Declined</option>
                </SelectInput>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <FilePlus className="h-4 w-4" />
                  New Primary Application
                </button>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">ST FileNo</th>
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
                {filtered.map((a) => (
                  <tr
                    key={a.stFileNo}
                    className="border-b border-border/60 last:border-0 align-top transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{a.stFileNo}</div>
                      <div className="text-xs text-muted-foreground">{a.mlsFileNo}</div>
                    </td>
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
                        <Avatar name={a.owner} />
                        <span className="max-w-[120px] truncate">{a.owner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {a.units.allocated} of {a.units.total}
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
        </SectionCard>
      </div>
    </AppShell>
  )
}
