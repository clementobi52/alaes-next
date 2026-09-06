'use client'

import { useMemo, useState } from 'react'
import {
  Layers,
  Boxes,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
  Eye,
  Building,
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
  PARENTED_STATS,
  PARENTED_SCHEMES,
  statusTone,
  landUseTone,
  unitOverallStatus,
  type ApprovalStage,
  type MotherScheme,
} from '@/lib/sectional-titling-data'

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

export default function ParentedUnitsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')

  const schemes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PARENTED_SCHEMES.map((scheme) => {
      const units = scheme.units.filter((u) => {
        if (status && unitOverallStatus(u) !== status) return false
        if (
          q &&
          !`${scheme.motherFileNo} ${scheme.property} ${scheme.developer} ${u.unitFileNo} ${u.unitOwner}`
            .toLowerCase()
            .includes(q)
        )
          return false
        return true
      })
      return { ...scheme, units }
    }).filter((s) => s.units.length > 0)
  }, [query, status])

  return (
    <AppShell
      title="Parented Unit Applications"
      subtitle="Units claimed under a mother (primary) sectional titling scheme."
      metrics={[]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile icon={Layers} label="Mother Schemes" value={PARENTED_STATS.motherSchemes} tone="violet" hint="Active parents" />
          <StatTile icon={Boxes} label="Total Units" value={PARENTED_STATS.totalUnits} tone="blue" hint="Across all schemes" />
          <StatTile icon={CheckCircle2} label="Approved" value={PARENTED_STATS.approved} tone="green" hint="Director signed" />
          <StatTile icon={Clock} label="Pending" value={PARENTED_STATS.pending} tone="amber" hint="In pipeline" />
        </div>

        <SectionCard>
          <SectionHeader
            title="Unit Applications by Scheme"
            description="Expand a mother scheme to review its individual unit applications"
            actions={
              <div className="flex items-center gap-2">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Search scheme, owner or unit…"
                  className="w-56"
                />
                <SelectInput value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-36">
                  <option value="">All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Declined</option>
                </SelectInput>
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

          <div className="space-y-4">
            {schemes.map((scheme) => (
              <SchemeGroup key={scheme.schemeNo} scheme={scheme} />
            ))}
            {schemes.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                No units match your filters.
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}

function SchemeGroup({ scheme }: { scheme: MotherScheme }) {
  const [open, setOpen] = useState(true)
  const approved = scheme.units.filter((u) => unitOverallStatus(u) === 'Approved').length

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted/70"
      >
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`}
        />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">{scheme.motherFileNo}</span>
            <span className="text-xs text-muted-foreground">· {scheme.schemeNo}</span>
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {scheme.property} — {scheme.developer}
          </div>
        </div>
        <StatusBadge tone={landUseTone(scheme.landUse)} dot={false}>
          {scheme.landUse}
        </StatusBadge>
        <span className="hidden shrink-0 rounded-md bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline">
          {approved}/{scheme.units.length} approved · {scheme.totalUnits} total units
        </span>
      </button>

      {open && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Unit FileNo</th>
                <th className="px-4 py-2.5 font-medium">Unit No</th>
                <th className="px-4 py-2.5 font-medium">Unit Owner</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">App Date</th>
                <th className="px-4 py-2.5 font-medium">JSI Status</th>
                <th className="px-4 py-2.5 font-medium">JSI Approval</th>
                <th className="px-4 py-2.5 font-medium">Planning</th>
                <th className="px-4 py-2.5 font-medium">Director</th>
                <th className="px-4 py-2.5 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheme.units.map((u) => (
                <tr
                  key={u.unitFileNo}
                  className="border-b border-border/60 align-top transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 text-muted-foreground">{u.unitFileNo}</td>
                  <td className="px-4 py-3 font-medium">{u.unitNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.unitOwner} />
                      <span className="max-w-[140px] truncate">{u.unitOwner}</span>
                    </div>
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
