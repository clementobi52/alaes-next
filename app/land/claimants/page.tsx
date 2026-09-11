'use client'

import { useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Search, SlidersHorizontal, Users, MapPin, FileText, CheckCircle2, RotateCcw } from 'lucide-react'

const claimants = [
  { id: 'CLM-00124', name: 'Chinedu Okafor', fileNo: 'LUAC/AB/03517/AB', property: 'Residential plot', location: 'Aba', status: 'Verified', date: '09 Sep 2026' },
  { id: 'CLM-00123', name: 'Nwachukwu Emeka', fileNo: 'LUAC/AB/02894/UM', property: 'Commercial property', location: 'Umuahia', status: 'Pending review', date: '09 Sep 2026' },
  { id: 'CLM-00122', name: 'Obinna Kalu', fileNo: 'LUM/02893', property: 'Commercial property', location: 'Umuahia', status: 'Verified', date: '08 Sep 2026' },
  { id: 'CLM-00121', name: 'Adaobi Nnaji', fileNo: 'LABA/02892', property: 'Residential plot', location: 'Aba', status: 'Verified', date: '08 Sep 2026' },
  { id: 'CLM-00120', name: 'Kelvin Onuorah', fileNo: 'LUM/OH/02891', property: 'Agricultural land', location: 'Ohafia', status: 'Pending review', date: '07 Sep 2026' },
  { id: 'CLM-00119', name: 'Ifeoma Eze', fileNo: 'LUAC/AB/02890/AB', property: 'Residential plot', location: 'Aba', status: 'Verified', date: '06 Sep 2026' },
  { id: 'CLM-00118', name: 'Chukwudi Mba', fileNo: 'LUAC/AB/02889/UM', property: 'Commercial property', location: 'Umuahia', status: 'Archived', date: '05 Sep 2026' },
  { id: 'CLM-00117', name: 'Ngozi Nwankwo', fileNo: 'LUM/02888', property: 'Residential plot', location: 'Umuahia', status: 'Verified', date: '04 Sep 2026' },
]

const statCards = [
  { label: 'Total claimants', value: '1,248', note: 'All registered records', icon: Users, tone: 'text-blue-600 bg-blue-50' },
  { label: 'Verified', value: '986', note: '79% of all claimants', icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
  { label: 'Pending review', value: '214', note: 'Requires attention', icon: FileText, tone: 'text-amber-600 bg-amber-50' },
  { label: 'Locations', value: '17', note: 'LGAs represented', icon: MapPin, tone: 'text-violet-600 bg-violet-50' },
]

export default function LandClaimantsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All locations')
  const [status, setStatus] = useState('All statuses')
  const filtered = useMemo(() => claimants.filter((claimant) => {
    const haystack = `${claimant.id} ${claimant.name} ${claimant.fileNo} ${claimant.property}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (location === 'All locations' || claimant.location === location) && (status === 'All statuses' || claimant.status === status)
  }), [query, location, status])

  function resetFilters() { setQuery(''); setLocation('All locations'); setStatus('All statuses') }

  return (
    <AppShell title="Land Claimant List" subtitle={`${filtered.length} of ${claimants.length} sample records shown`}>
      <div className="space-y-6">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Land Management</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">Land Claimant List</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Search and review registered land claimants, their file references, and verification status.</p></div>
          <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm">Export list</button>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statCards.map(({ label, value, note, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div><div className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></div></div></div>)}</div>
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative flex-1 lg:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search claimant, file number..." className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div><div className="flex flex-wrap gap-2"><select value={location} onChange={(event) => setLocation(event.target.value)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm"><option>All locations</option><option>Aba</option><option>Umuahia</option><option>Ohafia</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm"><option>All statuses</option><option>Verified</option><option>Pending review</option><option>Archived</option></select><button type="button" onClick={resetFilters} className="inline-flex h-11 items-center gap-2 rounded-xl border border-input px-3 text-sm text-muted-foreground hover:bg-muted"><RotateCcw className="size-4" />Reset</button><button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl border border-input px-3 text-sm text-muted-foreground hover:bg-muted"><SlidersHorizontal className="size-4" />More filters</button></div></div>
          <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-sm"><thead><tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"><th className="px-5 py-4">Claimant</th><th className="px-5 py-4">File number</th><th className="px-5 py-4">Property type</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Date registered</th></tr></thead><tbody>{filtered.map((claimant) => <tr key={claimant.id} className="border-b border-border/60 hover:bg-muted/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{claimant.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><p className="font-semibold">{claimant.name}</p><p className="text-xs text-muted-foreground">{claimant.id}</p></div></div></td><td className="px-5 py-4 font-mono text-xs text-primary">{claimant.fileNo}</td><td className="px-5 py-4">{claimant.property}</td><td className="px-5 py-4">{claimant.location}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${claimant.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : claimant.status === 'Pending review' ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'}`}>{claimant.status}</span></td><td className="px-5 py-4 text-muted-foreground">{claimant.date}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">No claimants match the selected filters.</td></tr>}</tbody></table></div>
          <div className="flex items-center justify-between border-t border-border px-5 py-4 text-xs text-muted-foreground"><span>Showing {filtered.length} sample records</span><span>Sample data — database connection can be added next</span></div>
        </section>
      </div>
    </AppShell>
  )
}
