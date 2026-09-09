'use client'

import { useMemo, useState } from 'react'
import {
  Database,
  FileText,
  Layers,
  Map as MapIcon,
  PlusCircle,
  Download,
  RefreshCw,
  Clock,
  User,
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import {
  SectionCard,
  SectionHeader,
  StatTile,
  StatusBadge,
  Avatar,
  SearchBar,
  Field,
  SelectInput,
  Modal,
} from '@/components/system-admin/primitives'
import {
  FILENO_STATS,
  FILENO_RECORDS,
  FILENO_PREFIXES,
  FILENO_SUFFIXES,
  FILENO_SCHEDULES,
  FILENO_SCHEDULE_RULES,
  buildFileNo,
  statusTone,
  landUseTone,
  type FileNoPrefix,
  type FileNoSuffix,
  type FileNoSchedule,
} from '@/lib/sectional-titling-data'

const QUICK_ACTIONS = [
  { label: "Today's Files", icon: Calendar },
  { label: 'Pending Review', icon: AlertCircle },
  { label: 'Primary Only', icon: FileText },
]

export default function FileNoManagementPage() {
  const [search, setSearch] = useState('')
  const [landUse, setLandUse] = useState('')
  const [fileType, setFileType] = useState('')
  const [year, setYear] = useState('')
  const [status, setStatus] = useState('')
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [schedule, setSchedule] = useState<FileNoSchedule>('Aba')
  const [prefix, setPrefix] = useState<FileNoPrefix>('LUAC/AB')
  const [suffix, setSuffix] = useState<FileNoSuffix>('AB')
  const [sequence, setSequence] = useState('1')
  const [generated, setGenerated] = useState('')

  const scheduleRule = FILENO_SCHEDULE_RULES[schedule]
  const allowedPrefixes = scheduleRule.prefixes
  const fileNoPreview = buildFileNo(prefix, Number(sequence) || 0, suffix)

  const handleScheduleChange = (value: FileNoSchedule) => {
    setSchedule(value)
    const nextPrefix = FILENO_SCHEDULE_RULES[value].prefixes[0]
    setPrefix(nextPrefix)
    setSuffix(FILENO_SCHEDULE_RULES[value].suffixes[0] ?? 'AB')
  }

  const handleCommission = () => {
    if (!sequence || Number(sequence) < 1 || Number(sequence) > 99999) return
    setGenerated(fileNoPreview)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return FILENO_RECORDS.filter((r) => {
      if (
        q &&
        ![r.stFileNo, r.mlsFileNo, r.applicant, r.commissionedBy]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
        return false
      if (landUse && r.landUse !== landUse) return false
      if (fileType && r.type !== fileType) return false
      if (year && String(r.year) !== year) return false
      if (status && r.status !== status) return false
      return true
    })
  }, [search, landUse, fileType, year, status])

  const clearAll = () => {
    setSearch('')
    setLandUse('')
    setFileType('')
    setYear('')
    setStatus('')
  }

  return (
    <AppShell
      title="Generate New FileNo (MLSFileNo)"
      subtitle="Generate, search, and manage land module MLS file numbers."
      metrics={[]}
    >
      <div className="space-y-6">
        {/* Header banner */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-6 text-primary-foreground">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Database className="h-8 w-8" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">MLSPP File Number Generator</h2>
                  <p className="text-sm text-primary-foreground/80">
                    View, search, and manage all ST FileNo in the system
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated: <span className="font-medium text-primary-foreground">11:06 PM</span>
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Welcome, <span className="font-medium text-primary-foreground">System Admin</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setCommissionOpen(true)}
                className="group flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-105"
              >
                <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90" />
                Generate New File Number
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  type="button"
                  className="group flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/20 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <SectionCard className="flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/70"
            >
              <a.icon className="h-3.5 w-3.5" />
              {a.label}
            </button>
          ))}
        </SectionCard>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile icon={Database} label="Total FileNo" value={FILENO_STATS.total} tone="green" />
          <StatTile icon={FileText} label="Primary Applications" value={FILENO_STATS.primary} tone="blue" />
          <StatTile icon={Layers} label="SuA Applications" value={FILENO_STATS.sua} tone="violet" />
          <StatTile icon={MapIcon} label="PuA Applications" value={FILENO_STATS.pua} tone="amber" />
        </div>

        {/* Filters */}
        <SectionCard>
          <SectionHeader
            title="Filters & Search"
            actions={
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            }
          />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="sm:col-span-2">
              <Field label="Search">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search FileNo, names, etc."
                />
              </Field>
            </div>
            <Field label="Land Use">
              <SelectInput value={landUse} onChange={(e) => setLandUse(e.target.value)}>
                <option value="">All Land Uses</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
                <option>Mixed-Use</option>
              </SelectInput>
            </Field>
            <Field label="File Type">
              <SelectInput value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="">All Types</option>
                <option>Primary</option>
                <option>SuA</option>
                <option>PuA</option>
              </SelectInput>
            </Field>
            <Field label="Year">
              <SelectInput value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">All Years</option>
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option>Generated</option>
                <option>Reserved</option>
                <option>Expired</option>
              </SelectInput>
            </Field>
          </div>
        </SectionCard>

        {/* Table */}
        <SectionCard>
          <SectionHeader
            title="FileNo Table"
            description={`${filtered.length} record${filtered.length === 1 ? '' : 's'}`}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">S/N</th>
                  <th className="px-4 py-3 font-medium">ST File No</th>
                  <th className="px-4 py-3 font-medium">MLS File No</th>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Land Use</th>
                  <th className="px-4 py-3 text-center font-medium">Units</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Commissioned</th>
                  <th className="px-4 py-3 font-medium">By</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.sn}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 text-muted-foreground">{r.sn}</td>
                    <td className="px-4 py-3 font-medium text-primary">{r.stFileNo}</td>
                    <td className="px-4 py-3">{r.mlsFileNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={r.applicant} />
                        <span className="truncate">{r.applicant}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={landUseTone(r.landUse)} dot={false}>
                        {r.landUse}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={
                          r.units.allocated >= r.units.total
                            ? 'font-medium text-destructive'
                            : 'text-muted-foreground'
                        }
                      >
                        {r.units.allocated} / {r.units.total}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.year}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.commissioningDate}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.commissionedBy}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                      No file numbers match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={commissionOpen}
        onClose={() => setCommissionOpen(false)}
        title="Generate New MLS FileNo"
        description="Select the schedule and nomenclature used to generate the next sectional titling file number."
        widthClass="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => setCommissionOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
              Cancel
            </button>
            <button type="button" onClick={handleCommission} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <CheckCircle2 className="h-4 w-4" />
              Commission FileNo
            </button>
          </div>
        }
      >
        <div className="space-y-5 p-5">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live FileNo Preview</p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-wide text-foreground">{fileNoPreview}</p>
            <p className="mt-2 text-sm text-muted-foreground">{scheduleRule.helper}</p>
          </div>
          {generated && (
            <div className="flex items-center gap-2 rounded-lg border border-chart-2/30 bg-chart-2/10 px-4 py-3 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
              Generated FileNo: <span className="font-mono font-semibold">{generated}</span>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Schedule">
              <SelectInput value={schedule} onChange={(e) => handleScheduleChange(e.target.value as FileNoSchedule)}>
                {FILENO_SCHEDULES.map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Sequence (5 digits)">
              <input type="number" min="1" max="99999" value={sequence} onChange={(e) => setSequence(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </Field>
            <Field label="File Prefix">
              <SelectInput value={prefix} onChange={(e) => setPrefix(e.target.value as FileNoPrefix)}>
                {FILENO_PREFIXES.filter((item) => allowedPrefixes.includes(item)).map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
            <Field label="Suffix">
              <SelectInput value={suffix} disabled={scheduleRule.suffixes.length === 0 || prefix !== 'LUAC/AB'} onChange={(e) => setSuffix(e.target.value as FileNoSuffix)}>
                {(scheduleRule.suffixes.length ? scheduleRule.suffixes : FILENO_SUFFIXES).map((item) => <option key={item}>{item}</option>)}
              </SelectInput>
            </Field>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold text-foreground">Accepted formats</p>
            <p className="mt-1 font-mono text-xs leading-6 text-muted-foreground">LUAC/AB/xxxxx/AB · LUAC/AB/xxxxx/UM · LUM/xxxxx · LABA/xxxxx · LUM/OH/xxxxx</p>
            <p className="mt-2 text-xs text-muted-foreground">The sequence is always padded to five digits, for example <span className="font-mono">00027</span>.</p>
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
