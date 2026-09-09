'use client'

import { useMemo, useState } from 'react'
import { BarChart3, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Download, FileCheck2, FileText, Plus, Printer, Settings2, UserRound, X } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Avatar, Field, Modal, SearchBar, SelectInput, StatusBadge } from '@/components/system-admin/primitives'
import { FILENO_RECORDS, FILENO_SCHEDULE_RULES, FILENO_SCHEDULES, buildFileNo, landUseTone, type FileNoPrefix, type FileNoSchedule, type FileNoSuffix } from '@/lib/sectional-titling-data'

export default function FileNoManagementPage() {
  const [search, setSearch] = useState('')
  const [landUse, setLandUse] = useState('')
  const [fileType, setFileType] = useState('')
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [schedule, setSchedule] = useState<FileNoSchedule>('Aba')
  const [prefix, setPrefix] = useState<FileNoPrefix>('LUAC/AB')
  const [suffix, setSuffix] = useState<FileNoSuffix>('AB')
  const [sequence, setSequence] = useState('1')
  const [generated, setGenerated] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20
  const scheduleRule = FILENO_SCHEDULE_RULES[schedule]
  const preview = buildFileNo(prefix, Number(sequence) || 0, suffix)
  const filtered = useMemo(() => FILENO_RECORDS.filter((record) => {
    const query = search.trim().toLowerCase()
    return (!query || [record.mlsFileNo, record.applicant, record.type].join(' ').toLowerCase().includes(query)) && (!landUse || record.landUse === landUse) && (!fileType || record.type === fileType)
  }), [search, landUse, fileType])
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const handleScheduleChange = (value: FileNoSchedule) => { setSchedule(value); setPrefix(FILENO_SCHEDULE_RULES[value].prefixes[0]); setSuffix(FILENO_SCHEDULE_RULES[value].suffixes[0] ?? 'AB') }

  return (
    <AppShell title="Land" subtitle="Generate New FileNo (MLSFileNo)" metrics={[]}>
      <div className="min-h-screen bg-muted/30 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1800px] space-y-6">
          <div className="flex items-end gap-1 border-b border-border">
            <button className="flex items-center gap-3 rounded-t-xl bg-background px-7 py-4 text-lg font-semibold text-foreground shadow-sm"><FileText className="size-6 text-primary" /> MLPP File Number Generator</button>
            <button className="flex items-center gap-3 rounded-t-xl px-7 py-4 text-lg font-semibold text-muted-foreground hover:bg-background/70"><Settings2 className="size-6" /> Serial Initialization</button>
            <button className="flex items-center gap-3 rounded-t-xl px-7 py-4 text-lg font-semibold text-muted-foreground hover:bg-background/70"><FileCheck2 className="size-6" /> Consolidated Report</button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_1.3fr_1.35fr_1.35fr_1.35fr]">
            <button type="button" onClick={() => setCommissionOpen(true)} className="flex min-h-32 items-center justify-center gap-5 rounded-xl bg-primary px-6 text-xl font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"><Plus className="size-8" /> <span className="max-w-48 text-pretty">Generate New File Number</span></button>
            <button type="button" className="flex min-h-32 items-center justify-center gap-5 rounded-xl bg-chart-2 px-6 text-xl font-medium text-primary-foreground shadow-sm transition hover:opacity-90"><Printer className="size-8" /> <span className="max-w-64 text-pretty">Print Batch Commissioning Sheet</span></button>
            <SummaryCard icon={FileCheck2} label="Total Commissioned" value="6,301" note="Excludes legacy" tone="blue" />
            <SummaryCard icon={CalendarDays} label="Commissioned Today" value="0" note="Sep 9, 2026" tone="green" />
            <SummaryCard icon={BarChart3} label="Commissioned This Month" value="96" note="September 2026" tone="violet" />
          </div>

          <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex items-end gap-3 text-lg"><span>Show</span><select className="h-11 rounded-md border border-input bg-background px-3"><option>20</option><option>50</option><option>100</option></select><span>file numbers per page</span></div>
              <div className="flex items-center gap-2 text-lg text-muted-foreground"><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-2 disabled:opacity-40">Previous</button>{[1, 2, 3, 4, 5].map((item) => <button key={item} type="button" onClick={() => setPage(item)} className={`size-11 rounded-md ${page === item ? 'border border-primary bg-primary/10 text-primary' : ''}`}>{item}</button>)}<span>...</span><button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} className="px-3 py-2">Next</button></div>
              <Field label="Search file numbers"><SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search file numbers..." /></Field>
            </div>
            <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-5 md:flex-row">
              <div className="flex-1"><Field label="Land Use"><SelectInput value={landUse} onChange={(event) => { setLandUse(event.target.value); setPage(1) }}><option value="">All Land Uses</option><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Mixed-Use</option></SelectInput></Field></div>
              <div className="flex-1"><Field label="File Type"><SelectInput value={fileType} onChange={(event) => { setFileType(event.target.value); setPage(1) }}><option value="">All Types</option><option>Primary</option><option>SuA</option><option>PuA</option></SelectInput></Field></div>
              <button type="button" onClick={() => { setSearch(''); setLandUse(''); setFileType(''); setPage(1) }} className="inline-flex h-10 items-center gap-2 self-end px-3 text-sm text-muted-foreground hover:text-foreground"><X className="size-4" /> Clear filters</button>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[1700px] text-sm"><thead><tr className="border-b-2 border-foreground/80 bg-muted/30 text-left text-sm uppercase tracking-wider text-muted-foreground"><th className="px-5 py-4">S/N</th><th className="px-5 py-4">Customer Type</th><th className="px-5 py-4">Source</th><th className="px-5 py-4">Passport</th><th className="px-5 py-4">MLS File No</th><th className="px-5 py-4">File Title</th><th className="px-5 py-4">Land Use</th><th className="px-5 py-4">TP No</th><th className="px-5 py-4">House No</th><th className="px-5 py-4">Plot No</th><th className="px-5 py-4">District</th></tr></thead><tbody>
              {visible.map((record, index) => <tr key={`${record.sn}-${index}`} className="border-b border-border/70 hover:bg-muted/20"><td className="px-5 py-5 text-lg">{record.sn}</td><td className="px-5 py-5 text-lg font-semibold">{record.type === 'Primary' ? 'Individual' : 'Corporate'}</td><td className="px-5 py-5"><StatusBadge tone="blue" dot={false}>{record.type === 'Primary' ? 'Conversion' : 'Direct Allocation'}</StatusBadge></td><td className="px-5 py-5"><Avatar name={record.applicant} /></td><td className="px-5 py-5 text-lg font-bold text-foreground">{record.mlsFileNo}</td><td className="max-w-72 px-5 py-5 text-lg">{record.applicant}</td><td className="px-5 py-5"><StatusBadge tone={landUseTone(record.landUse)} dot={false}>{record.landUse}</StatusBadge><div className="mt-1 text-xs font-semibold text-muted-foreground">{record.landUse}</div></td><td className="px-5 py-5 text-lg">N/A</td><td className="px-5 py-5 text-lg">N/A</td><td className="px-5 py-5 text-lg">N/A</td><td className="px-5 py-5 text-lg">N/A</td></tr>)}
              {!visible.length && <tr><td colSpan={11} className="px-5 py-16 text-center text-muted-foreground">No file numbers match your filters.</td></tr>}
            </tbody></table></div>
          </section>
        </div>
      </div>
      <Modal open={commissionOpen} onClose={() => setCommissionOpen(false)} title="Generate New MLS FileNo" description="Select the schedule and nomenclature used to generate the next file number." widthClass="max-w-2xl" footer={<div className="flex justify-end gap-3"><button type="button" onClick={() => setCommissionOpen(false)} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button><button type="button" onClick={() => setGenerated(preview)} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Generate FileNo</button></div>}>
        <div className="flex flex-col gap-5 p-5"><div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Live FileNo Preview</p><p className="mt-2 font-mono text-2xl font-bold">{generated || preview}</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Schedule"><SelectInput value={schedule} onChange={(event) => handleScheduleChange(event.target.value as FileNoSchedule)}>{FILENO_SCHEDULES.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field><Field label="Sequence"><input type="number" min="1" max="99999" value={sequence} onChange={(event) => setSequence(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" /></Field><Field label="File Prefix"><SelectInput value={prefix} onChange={(event) => setPrefix(event.target.value as FileNoPrefix)}>{scheduleRule.prefixes.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field><Field label="Suffix"><SelectInput value={suffix} onChange={(event) => setSuffix(event.target.value as FileNoSuffix)}>{(scheduleRule.suffixes.length ? scheduleRule.suffixes : ['AB']).map((item) => <option key={item}>{item}</option>)}</SelectInput></Field></div><p className="text-sm text-muted-foreground">{scheduleRule.helper}</p></div>
      </Modal>
    </AppShell>
  )
}

function SummaryCard({ icon: Icon, label, value, note, tone }: { icon: typeof FileCheck2; label: string; value: string; note: string; tone: 'blue' | 'green' | 'violet' }) {
  const styles = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', violet: 'bg-violet-50 text-violet-700' }
  return <div className="flex min-h-32 items-center gap-5 rounded-xl border border-border bg-background p-6 shadow-sm"><span className={`flex size-16 items-center justify-center rounded-xl ${styles[tone]}`}><Icon className="size-9" /></span><div><p className="text-xl text-muted-foreground">{label}</p><p className="text-4xl font-bold tracking-tight">{value}</p><p className="mt-1 text-base text-muted-foreground">{note}</p></div></div>
}
