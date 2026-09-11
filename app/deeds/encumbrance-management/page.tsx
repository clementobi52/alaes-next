'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { FilePlus2, MoreHorizontal, Pencil, Search, Trash2, X } from 'lucide-react'

type EncumbranceType = 'Caveat' | 'Mortgage' | 'Surrender & Release' | 'Lien'
type Record = { reference: string; type: EncumbranceType; party: string; amount: string; status: string; updated: string; property: string }

const seedRecords: Record[] = [
  { reference: 'LABA/10482', type: 'Caveat', party: 'Ngozi Adaeze', amount: '—', status: 'Active', updated: '10 Sep 2026', property: 'Aba North · Plot 18' },
  { reference: 'LUM/1854', type: 'Mortgage', party: 'First Abia Bank Plc', amount: '₦18,500,000', status: 'Pending registration', updated: '09 Sep 2026', property: 'Umuahia North · Plot 44' },
  { reference: 'LUAC/AB/00127/AB', type: 'Surrender & Release', party: 'Emeka Uche', amount: '—', status: 'Released', updated: '08 Sep 2026', property: 'Aba South · Plot 07' },
  { reference: 'LUM/OH/00319', type: 'Lien', party: 'Abia Development Fund', amount: '₦4,200,000', status: 'Active', updated: '07 Sep 2026', property: 'Ohafia · Plot 31' },
]
const types: Array<'All' | EncumbranceType> = ['All', 'Caveat', 'Mortgage', 'Surrender & Release', 'Lien']

export default function EncumbranceManagementPage() {
  const searchParams = useSearchParams()
  const [records, setRecords] = useState(seedRecords)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof types)[number]>('All')
  const [openAction, setOpenAction] = useState<string | null>(null)
  const [editing, setEditing] = useState<Record | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Record>({ reference: '', type: 'Caveat', party: '', amount: '—', status: 'Active', updated: '11 Sep 2026', property: '' })

  useEffect(() => {
    const requestedType = searchParams.get('type')
    const typeMap: { [key: string]: EncumbranceType } = { caveat: 'Caveat', mortgage: 'Mortgage', release: 'Surrender & Release', lien: 'Lien' }
    setFilter(requestedType ? typeMap[requestedType] ?? 'All' : 'All')
  }, [searchParams])

  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesType = filter === 'All' || record.type === filter
    const haystack = `${record.reference} ${record.party} ${record.property} ${record.type}`.toLowerCase()
    return matchesType && haystack.includes(query.toLowerCase())
  }), [records, filter, query])

  function startCreate() { setEditing(null); setForm({ reference: '', type: 'Caveat', party: '', amount: '—', status: 'Active', updated: '11 Sep 2026', property: '' }); setShowForm(true) }
  function startEdit(record: Record) { setEditing(record); setForm(record); setShowForm(true); setOpenAction(null) }
  function saveRecord() {
    if (!form.reference.trim() || !form.party.trim() || !form.property.trim()) return
    setRecords((current) => editing ? current.map((record) => record.reference === editing.reference ? form : record) : [form, ...current])
    setShowForm(false)
  }

  return <AppShell title="Encumbrance Management" subtitle="Deeds · Abia State property restrictions and interests">
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-4">{[['Active caveats', records.filter((r) => r.type === 'Caveat' && r.status === 'Active').length], ['Mortgages', records.filter((r) => r.type === 'Mortgage').length], ['Pending releases', records.filter((r) => r.type === 'Surrender & Release').length], ['Active liens', records.filter((r) => r.type === 'Lien' && r.status === 'Active').length]].map(([label, value]) => <button type="button" key={label} onClick={() => setFilter(label === 'Active caveats' ? 'Caveat' : label === 'Mortgages' ? 'Mortgage' : label === 'Pending releases' ? 'Surrender & Release' : 'Lien')} className="rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary/50 hover:shadow-sm"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></button>)}</section>
      <section className="rounded-xl border border-border bg-card"><div className="flex flex-col gap-4 border-b border-border p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Encumbrance register</h2><p className="mt-1 text-sm text-muted-foreground">Search and manage caveats, mortgages, releases, and liens.</p></div><button type="button" onClick={startCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><FilePlus2 className="size-4" />Create encumbrance</button></div><div className="flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><span className="sr-only">Search encumbrances</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by file number, party, property..." className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm" /></label><div className="flex flex-wrap gap-2">{types.map((type) => <button type="button" key={type} onClick={() => setFilter(type)} className={`rounded-lg border px-3 py-2 text-sm ${filter === type ? 'border-primary bg-primary/10 text-primary' : 'border-input hover:bg-muted'}`}>{type}</button>)}</div></div></div><div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr>{['File number', 'Type', 'Interested party', 'Property', 'Amount', 'Status', 'Updated', 'Action'].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{filteredRecords.map((record) => <tr key={`${record.reference}-${record.type}`} className="hover:bg-muted/20"><td className="px-5 py-4 font-mono text-xs">{record.reference}</td><td className="px-5 py-4 font-medium">{record.type}</td><td className="px-5 py-4">{record.party}</td><td className="px-5 py-4">{record.property}</td><td className="px-5 py-4">{record.amount}</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{record.status}</span></td><td className="px-5 py-4 text-muted-foreground">{record.updated}</td><td className="relative px-5 py-4"><button type="button" aria-label={`Actions for ${record.reference}`} onClick={() => setOpenAction(openAction === record.reference ? null : record.reference)} className="rounded-md p-1 hover:bg-muted"><MoreHorizontal className="size-4" /></button>{openAction === record.reference && <div className="absolute right-5 top-12 z-20 w-40 rounded-lg border border-border bg-popover p-1 shadow-lg"><button type="button" onClick={() => startEdit(record)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"><Pencil className="size-4" />View / Edit</button><button type="button" onClick={() => { setRecords((current) => current.filter((item) => item.reference !== record.reference)); setOpenAction(null) }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted"><Trash2 className="size-4" />Delete</button></div>}</td></tr>)}{filteredRecords.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">No encumbrances match your filters.</td></tr>}</tbody></table></div></section>
    </div>
    {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-primary">Abia State Deeds Registry</p><h2 className="text-xl font-semibold">{editing ? 'Edit encumbrance' : 'Create encumbrance'}</h2></div><button type="button" onClick={() => setShowForm(false)} className="rounded-md p-2 hover:bg-muted" aria-label="Close"><X className="size-4" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">File number<input value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} className="rounded-lg border border-input bg-background px-3 py-2" /></label><label className="grid gap-2 text-sm font-medium">Encumbrance type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as EncumbranceType })} className="rounded-lg border border-input bg-background px-3 py-2">{types.slice(1).map((type) => <option key={type}>{type}</option>)}</select></label><label className="grid gap-2 text-sm font-medium">Interested party<input value={form.party} onChange={(event) => setForm({ ...form, party: event.target.value })} className="rounded-lg border border-input bg-background px-3 py-2" /></label><label className="grid gap-2 text-sm font-medium">Property / location<input value={form.property} onChange={(event) => setForm({ ...form, property: event.target.value })} className="rounded-lg border border-input bg-background px-3 py-2" /></label><label className="grid gap-2 text-sm font-medium">Amount<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-lg border border-input bg-background px-3 py-2" /></label><label className="grid gap-2 text-sm font-medium">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border border-input bg-background px-3 py-2"><option>Active</option><option>Pending registration</option><option>Released</option></select></label></div><div className="mt-6 flex justify-end gap-3 border-t border-border pt-4"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-input px-4 py-2 text-sm">Cancel</button><button type="button" onClick={saveRecord} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save encumbrance</button></div></div></div>}
  </AppShell>
}
