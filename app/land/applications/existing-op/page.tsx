'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Download, Factory, Home, Leaf, Layers3, Search, UserRound, Building2, Plus, MoreVertical } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { StatusBadge, Avatar } from '@/components/system-admin/primitives'

const records = [
  { file: 'RES-2026-3517', holder: 'BALA YUNUSA ABDULLAHI', type: 'RESIDENTIAL', location: '—', date: 'Sep 09, 2026' },
  { file: 'CON-RES-2026-2894', holder: 'ADO IBRAHIM', type: 'COMMERCIAL', location: 'GWALE', date: 'Sep 09, 2026' },
  { file: 'CON-RES-2026-2893', holder: 'KABIRU UBALE', type: 'COMMERCIAL', location: '—', date: 'Sep 09, 2026' },
  { file: 'CON-RES-2026-2892', holder: 'MUJITTAFA BALARABE HAMZA', type: 'COMMERCIAL', location: '—', date: 'Sep 09, 2026' },
  { file: 'CON-RES-2026-2891', holder: 'HARUNA BAKO MAI SHINKU', type: 'COMMERCIAL', location: '—', date: 'Sep 09, 2026' },
  { file: 'CON-RES-2026-2890', holder: 'ALH. MUSA MAI LESHI', type: 'COMMERCIAL', location: 'GWALE', date: 'Sep 09, 2026' },
  { file: 'CON-RES-2026-2889', holder: 'JAMILU IDRIS ABUBAKAR', type: 'COMMERCIAL', location: '—', date: 'Sep 08, 2026' },
  { file: 'CON-RES-2026-2888', holder: 'JAMILU IDRIS ABUBAKAR', type: 'COMMERCIAL', location: '—', date: 'Sep 08, 2026' },
  { file: 'COM-2026-330', holder: 'A .A RANO NIGERIA LIMITED', type: 'COMMERCIAL', location: '—', date: 'Sep 08, 2026' },
  { file: 'CON-RES-2026-2887', holder: 'JAMILU IDRIS ABUBAKAR', type: 'COMMERCIAL', location: 'KUMBOTSO', date: 'Sep 08, 2026' },
  { file: 'CON-RES-2026-2886', holder: 'ABDURRAHMAN IBRAHIM ABUBAKAR', type: 'COMMERCIAL', location: '—', date: 'Sep 08, 2026' },
  { file: 'CON-RES-2026-2885', holder: 'SANI ABDUSSALAM', type: 'COMMERCIAL', location: 'GWALE', date: 'Sep 08, 2026' },
]

const stats = [
  ['TOTAL RECORDS', '6,335', 'All categories', Layers3, 'text-violet-500', 'bg-violet-50'],
  ["TODAY'S RECORDS", '6', '09 Sep 2026', CalendarDays, 'text-indigo-500', 'bg-indigo-50'],
  ['RESIDENTIAL', '1,820', '', Home, 'text-emerald-600', 'bg-emerald-50'],
  ['COMMERCIAL', '3,695', '', Building2, 'text-blue-500', 'bg-blue-50'],
  ['INDUSTRIAL', '820', '', Factory, 'text-red-500', 'bg-red-50'],
  ['AGRICULTURAL', '0', '', Leaf, 'text-emerald-600', 'bg-emerald-50'],
] as const

export default function ExistingOpApplicationsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All Types')
  const filtered = useMemo(() => records.filter((record) => {
    const matchesSearch = `${record.file} ${record.holder} ${record.location}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (type === 'All Types' || record.type === type)
  }), [search, type])

  return <AppShell title="Applications (No Change of Ownership)" subtitle="50 of 6,335 record(s) loaded" metrics={[]}>
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">OSS Management</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Applications (No Change of Ownership)</h1><p className="mt-1 text-sm text-muted-foreground">50 of 6,335 record(s) loaded</p></div><div className="flex flex-wrap items-center gap-3"><label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground"><Search className="size-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications..." className="w-48 bg-transparent outline-none" /></label><select value={type} onChange={(event) => setType(event.target.value)} className="h-11 rounded-xl border border-border bg-card px-4 text-sm"><option>All Types</option><option>RESIDENTIAL</option><option>COMMERCIAL</option></select><select className="h-11 rounded-xl border border-border bg-card px-4 text-sm"><option>50 rows</option><option>20 rows</option></select><button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white"><Download className="size-4" />Export Records</button><button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white"><Plus className="size-4" />New Application</button></div></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{stats.map(([label, value, note, Icon, color, bg]) => <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-4"><div className={`flex size-14 items-center justify-center rounded-xl ${bg}`}><Icon className={`size-7 ${color}`} /></div><div><p className="text-xs font-medium tracking-widest text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p>{note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}</div></div></div>)}</div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><div className="overflow-x-auto"><table className="min-w-[1900px] w-full text-sm"><thead><tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"><th className="px-4 py-4">S/N</th><th className="px-4 py-4">File No</th><th className="px-4 py-4">Photo</th><th className="px-4 py-4">Holder</th><th className="px-4 py-4">Application Type</th><th className="px-4 py-4">Plot No</th><th className="px-4 py-4">Plan No</th><th className="px-4 py-4">District</th><th className="px-4 py-4">Location</th><th className="px-4 py-4">Applicant Address</th><th className="px-4 py-4">Phone</th><th className="px-4 py-4">Application Date</th><th className="px-4 py-4">Created By</th><th className="px-4 py-4">Date Created</th><th className="px-4 py-4">Actions</th></tr></thead><tbody>{filtered.map((record, index) => <tr key={record.file} className="border-b border-border/60 odd:bg-background even:bg-muted/20 hover:bg-blue-50/50"><td className="px-4 py-4 text-muted-foreground">{index + 1}</td><td className="px-4 py-4 font-medium text-blue-600">{record.file}</td><td className="px-4 py-4"><Avatar name={record.holder} /></td><td className="px-4 py-4 font-medium text-blue-600">{record.holder}</td><td className="px-4 py-4"><StatusBadge tone={record.type === 'RESIDENTIAL' ? 'green' : 'blue'} dot={false}>{record.type}</StatusBadge></td><td className="px-4 py-4">—</td><td className="px-4 py-4">—</td><td className="px-4 py-4">—</td><td className="px-4 py-4">{record.location}</td><td className="px-4 py-4">—</td><td className="px-4 py-4">—</td><td className="px-4 py-4 font-mono text-xs">{record.date}</td><td className="px-4 py-4">—</td><td className="px-4 py-4 font-mono text-xs">{record.date}</td><td className="px-4 py-4"><button type="button" aria-label={`Actions for ${record.file}`} className="rounded-md p-2 text-muted-foreground hover:bg-muted"><MoreVertical className="size-4" /></button></td></tr>)}</tbody></table></div></div>
    </div>
  </AppShell>
}
