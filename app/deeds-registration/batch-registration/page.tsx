'use client'

import { useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'

const initialRows = [
  { id: 1, file: 'LUAC/AB/03517/AB', instrument: 'Deed of Assignment', parties: 'Chinedu Okafor / Ngozi Nwankwo', status: 'Ready' },
  { id: 2, file: 'LABA/2019/5678', instrument: 'Deed of Lease', parties: 'Ibeku Traders Ltd / Emeka Eze', status: 'Ready' },
  { id: 3, file: 'LUM/02893', instrument: 'Power of Attorney', parties: 'Obinna Kalu / Adaeze Okorie', status: 'Validated' },
]

export default function BatchRegistrationPage() {
  const [rows, setRows] = useState(initialRows)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<number[]>([1, 2])
  const visible = useMemo(() => rows.filter((row) => `${row.file} ${row.instrument} ${row.parties}`.toLowerCase().includes(query.toLowerCase())), [rows, query])
  const toggle = (id: number) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const register = () => setRows((current) => current.map((row) => selected.includes(row.id) ? { ...row, status: 'Registered' } : row))

  return <AppShell title="Deeds Batch Registration" subtitle="Deeds / Deeds Registration"><main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"><section className="rounded-xl border bg-card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Batch registration queue</h2><p className="mt-1 text-sm text-muted-foreground">Validate and register multiple Abia deed instruments together.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file, instrument or party" className="h-10 w-full max-w-xs rounded-lg border bg-background px-3 text-sm" /></div><div className="mt-6 overflow-x-auto rounded-lg border"><table className="min-w-[900px] w-full text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">Select</th><th className="p-3">File number</th><th className="p-3">Instrument</th><th className="p-3">Parties</th><th className="p-3">Status</th></tr></thead><tbody>{visible.map((row) => <tr key={row.id} className="border-t"><td className="p-3"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggle(row.id)} aria-label={`Select ${row.file}`} /></td><td className="p-3 font-mono font-medium text-primary">{row.file}</td><td className="p-3">{row.instrument}</td><td className="p-3">{row.parties}</td><td className="p-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{row.status}</span></td></tr>)}</tbody></table></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{selected.length} instrument(s) selected</p><button type="button" onClick={register} disabled={!selected.length} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Register selected instruments</button></div></section></main></AppShell>
}
