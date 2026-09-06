'use client'

import { useMemo, useState } from 'react'
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  FilePlus,
  Eye,
  Home,
  Building2,
  Factory,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import {
  SectionCard,
  SectionHeader,
  StatTile,
  StatusBadge,
  Avatar,
  SearchBar,
  SelectInput,
} from '@/components/system-admin/primitives'
import {
  STANDALONE_STATS,
  STANDALONE_APPLICATIONS,
  ALLOCATION_SOURCES,
  statusTone,
  landUseTone,
  unitOverallStatus,
  type ApprovalStage,
  type UnitApplication,
} from '@/lib/sectional-titling-data'

const CREATE_OPTIONS = [
  { label: 'Residential', icon: Home, tone: 'blue' as const },
  { label: 'Commercial', icon: Building2, tone: 'green' as const },
  { label: 'Industrial', icon: Factory, tone: 'amber' as const },
]

function StageCell({ stage }: { stage: ApprovalStage }) {
  return (
    <div className="flex flex-col gap-1">
      <StatusBadge tone={statusTone(stage.status)} dot={false}>
        {stage.status}
      </StatusBadge>
      {stage.date && <span className="text-[10px] text-muted-foreground">{stage.date}</span>}
    </div>
  )
}

export default function StandaloneUnitsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [landUse, setLandUse] = useState('')
  const [source, setSource] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return STANDALONE_APPLICATIONS.filter((u) => {
      if (status && unitOverallStatus(u) !== status) return false
      if (landUse && u.landUse !== landUse) return false
      if (source && u.allocationSource !== source) return false
      if (
        q &&
        !`${u.unitFileNo} ${u.npFileNo} ${u.schemeNo} ${u.unitOwner}`.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [query, status, landUse, source])

  return (
    <AppShell
      title="Standalone Unit Applications (SUA)"
      subtitle="Manage standalone unit applications that have no mother application."
      metrics={[]}
    >
      <div className="space-y-6">
        {/* Stat tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile icon={FileText} label="Total SUA" value={STANDALONE_STATS.total} tone="blue" hint="All records" />
          <StatTile icon={CheckCircle2} label="Approved" value={STANDALONE_STATS.approved} tone="green" hint="Director signed" />
          <StatTile icon={Clock} label="Pending" value={STANDALONE_STATS.pending} tone="amber" hint="In pipeline" />
          <StatTile icon={XCircle} label="Rejected" value={STANDALONE_STATS.rejected} tone="red" hint="Declined" />
        </div>

        {/* Table */}
        <SectionCard>
          <SectionHeader
            title="Standalone Unit Applications"
            description="Each unit flows through the JSI, Planning and Director approval stages"
            actions={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                  >
                    <FilePlus className="h-4 w-4" />
                    Create SUA
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                      {CREATE_OPTIONS.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                        >
                          <StatusBadge tone={o.tone} dot={false}>
                            <o.icon className="h-3.5 w-3.5" />
                          </StatusBadge>
                          <span className="font-medium">{o.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            }
          />

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 border-b border-border pb-5 md:grid-cols-4">
            <SearchBar value={query} onChange={setQuery} placeholder="Search by file no or name…" />
            <SelectInput value={status} onChange={(e) => setStatus(e.target.value)} className="h-10">
              <option value="">All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Declined</option>
            </SelectInput>
            <SelectInput value={landUse} onChange={(e) => setLandUse(e.target.value)} className="h-10">
              <option value="">All Land Use</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Mixed-Use</option>
            </SelectInput>
            <SelectInput value={source} onChange={(e) => setSource(e.target.value)} className="h-10">
              <option value="">All Sources</option>
              {ALLOCATION_SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </SelectInput>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Scheme No</th>
                  <th className="px-4 py-3 font-medium">NP FileNo</th>
                  <th className="px-4 py-3 font-medium">Unit FileNo</th>
                  <th className="px-4 py-3 font-medium">Land Use</th>
                  <th className="px-4 py-3 font-medium">Allocation Source</th>
                  <th className="px-4 py-3 font-medium">Unit Owner</th>
                  <th className="px-4 py-3 font-medium">Unit No</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">App Date</th>
                  <th className="px-4 py-3 font-medium">JSI Status</th>
                  <th className="px-4 py-3 font-medium">JSI Approval</th>
                  <th className="px-4 py-3 font-medium">Planning</th>
                  <th className="px-4 py-3 font-medium">Director</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <UnitRow key={u.unitFileNo} u={u} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={14} className="px-4 py-12 text-center text-muted-foreground">
                      No standalone applications match your filters.
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

function UnitRow({ u }: { u: UnitApplication }) {
  return (
    <tr className="border-b border-border/60 align-top transition-colors last:border-0 hover:bg-muted/40">
      <td className="px-4 py-3 font-medium">{u.schemeNo}</td>
      <td className="px-4 py-3 font-medium text-primary">{u.npFileNo}</td>
      <td className="px-4 py-3 text-muted-foreground">{u.unitFileNo}</td>
      <td className="px-4 py-3">
        <StatusBadge tone={landUseTone(u.landUse)} dot={false}>
          {u.landUse}
        </StatusBadge>
      </td>
      <td className="px-4 py-3">
        <div>{u.allocationSource}</div>
        <div className="text-xs text-muted-foreground">{u.allocationEntity}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={u.unitOwner} />
          <span className="max-w-[130px] truncate">{u.unitOwner}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{u.unitNo}</td>
      <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
      <td className="px-4 py-3 text-muted-foreground">{u.applicationDate}</td>
      <td className="px-4 py-3"><StageCell stage={u.jsiStatus} /></td>
      <td className="px-4 py-3"><StageCell stage={u.jsiApproval} /></td>
      <td className="px-4 py-3"><StageCell stage={u.planningRecommendation} /></td>
      <td className="px-4 py-3"><StageCell stage={u.directorApproval} /></td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          aria-label={`View ${u.unitFileNo}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}
