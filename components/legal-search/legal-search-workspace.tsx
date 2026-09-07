'use client'

import { useMemo, useState } from 'react'
import { ClipboardCheck, Download, FileSearch, Filter, Search, ShieldCheck, SlidersHorizontal, WalletCards } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Avatar, Field, SearchBar, SectionCard, SectionHeader, SelectInput, StatTile, StatusBadge } from '@/components/system-admin/primitives'
import { LEGAL_SEARCH_RECORDS, OFFICIAL_REQUESTS, ON_PREMISE_REQUESTS, SEARCH_LAND_USES, SEARCH_LOCATIONS, SEARCH_TONES, filterRecords, type PropertyRecord } from '@/lib/legal-search-data'

const metrics = [
  { label: 'Records indexed', value: '4,297', tone: 'primary' as const },
  { label: 'Searches today', value: '38', tone: 'plain' as const },
  { label: 'Pending review', value: '07', tone: 'plain' as const },
]

function Hero({ kind }: { kind: 'records' | 'official' | 'on-premise' }) {
  const content = {
    records: { title: 'Property Records', description: 'Search indexed land records across Abia State with a complete audit trail.', icon: FileSearch },
    official: { title: 'Official Legal Search', description: 'Prepare verified property searches for filing, due diligence, and legal proceedings.', icon: ShieldCheck },
    'on-premise': { title: 'On-Premise Legal Search', description: 'Process counter-based, pay-per-search requests from the registry office.', icon: WalletCards },
  }[kind]
  const Icon = content.icon
  return <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/25 via-card to-card p-6 shadow-sm md:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Icon className="h-7 w-7" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Legal Search</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-balance">{content.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{content.description}</p></div></div>
      <div className="flex gap-2"><button type="button" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Search className="h-4 w-4" /> New search</button><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted"><Download className="h-4 w-4" /> Export</button></div>
    </div>
  </div>
}

function FilterBar({ onChange }: { onChange: (value: string) => void }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All locations')
  const [landUse, setLandUse] = useState('All land uses')
  const [status, setStatus] = useState('All statuses')
  const apply = (next: Partial<{ query: string; location: string; landUse: string; status: string }>) => {
    const values = { query, location, landUse, status, ...next }
    setQuery(values.query); setLocation(values.location); setLandUse(values.landUse); setStatus(values.status)
    onChange(JSON.stringify(values))
  }
  return <div className="grid gap-3 border-b border-border bg-muted/20 p-4 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(140px,180px))]"><SearchBar value={query} onChange={(value) => apply({ query: value })} placeholder="File number, owner, property…" /><SelectInput value={location} onChange={(e) => apply({ location: e.target.value })}>{SEARCH_LOCATIONS.map((value) => <option key={value}>{value}</option>)}</SelectInput><SelectInput value={landUse} onChange={(e) => apply({ landUse: e.target.value })}>{SEARCH_LAND_USES.map((value) => <option key={value}>{value}</option>)}</SelectInput><SelectInput value={status} onChange={(e) => apply({ status: e.target.value })}>{['All statuses', 'Verified', 'Pending', 'Archived', 'Flagged'].map((value) => <option key={value}>{value}</option>)}</SelectInput></div>
}

function RecordsTable({ records }: { records: PropertyRecord[] }) {
  return <SectionCard className="overflow-hidden"><SectionHeader title="Property record index" description={`${records.length} records match the active filters.`} actions={<button type="button" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"><Filter className="h-3.5 w-3.5" /> Advanced filters</button>} /><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">File number</th><th className="px-5 py-3">Property / owner</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Land use</th><th className="px-5 py-3">Instrument</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{records.map((record) => <tr key={record.id} className="transition-colors hover:bg-muted/20"><td className="px-5 py-4 font-mono text-xs font-semibold text-primary">{record.fileNo}</td><td className="px-5 py-4"><p className="font-medium">{record.property}</p><div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Avatar name={record.owner} className="h-6 w-6 text-[10px]" />{record.owner}</div></td><td className="px-5 py-4 text-muted-foreground">{record.location}</td><td className="px-5 py-4">{record.landUse}</td><td className="px-5 py-4 text-muted-foreground">{record.instrument}</td><td className="px-5 py-4"><StatusBadge tone={SEARCH_TONES[record.status]}>{record.status}</StatusBadge></td><td className="px-5 py-4 text-xs text-muted-foreground">{record.lastUpdated}</td></tr>)}</tbody></table></div></SectionCard>
}

function RequestTable({ kind }: { kind: 'official' | 'on-premise' }) {
  const official = kind === 'official'
  const rows = official ? OFFICIAL_REQUESTS : ON_PREMISE_REQUESTS
  return <SectionCard className="overflow-hidden"><SectionHeader title={official ? 'Official search requests' : 'Counter requests'} description={official ? 'Search certificates prepared for official filing purposes.' : 'Requests received from registry counters and pay-per-search desks.'} /><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Requester</th><th className="px-5 py-3">{official ? 'Purpose' : 'Counter'}</th><th className="px-5 py-3">{official ? 'Fee' : 'Token'}</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Submitted</th></tr></thead><tbody className="divide-y divide-border">{rows.map((row) => <tr key={row.id} className="hover:bg-muted/20"><td className="px-5 py-4"><p className="font-mono text-xs font-semibold text-primary">{row.reference}</p><p className="mt-1 text-xs text-muted-foreground">{row.id}</p></td><td className="px-5 py-4 font-medium">{row.requester}</td><td className="px-5 py-4 text-muted-foreground">{'purpose' in row ? row.purpose : row.counter}</td><td className="px-5 py-4 font-medium">{'fee' in row ? row.fee : row.token}</td><td className="px-5 py-4"><StatusBadge tone={row.status === 'Completed' || row.status === 'Ready' ? 'green' : row.status === 'Pending payment' ? 'amber' : 'blue'}>{row.status}</StatusBadge></td><td className="px-5 py-4 text-xs text-muted-foreground">{row.submitted}</td></tr>)}</tbody></table></div></SectionCard>
}

export function LegalSearchWorkspace({ kind }: { kind: 'records' | 'official' | 'on-premise' }) {
  const [filterState, setFilterState] = useState({ query: '', location: 'All locations', landUse: 'All land uses', status: 'All statuses' })
  const visibleRecords = useMemo(() => filterRecords(LEGAL_SEARCH_RECORDS, filterState.query, filterState.location, filterState.landUse, filterState.status), [filterState])
  const handleFilter = (value: string) => { try { setFilterState(JSON.parse(value)) } catch {} }
  const title = kind === 'records' ? 'Property Records' : kind === 'official' ? 'Official Legal Search' : 'On-Premise Legal Search'
  return <AppShell title={title} subtitle="Search and manage Abia State property records with a traceable legal workflow." metrics={metrics}><div className="mx-auto max-w-[1500px] space-y-6"><Hero kind={kind} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatTile icon={FileSearch} label="Indexed property records" value="4,297" hint="+12% this month" tone="green" /><StatTile icon={ShieldCheck} label={kind === 'records' ? 'Verified records' : 'Requests completed'} value={kind === 'records' ? '3,814' : '128'} hint="Across all zones" tone="blue" /><StatTile icon={ClipboardCheck} label="Pending review" value={kind === 'on-premise' ? '07' : '18'} hint="Needs attention" tone="amber" /><StatTile icon={SlidersHorizontal} label={kind === 'official' ? 'Filing searches' : 'Searches today'} value={kind === 'official' ? '42' : '38'} hint="Current period" tone="violet" /></div>{kind === 'records' ? <><FilterBar onChange={handleFilter} /><RecordsTable records={visibleRecords} /></> : <RequestTable kind={kind} />}</div></AppShell>
}
