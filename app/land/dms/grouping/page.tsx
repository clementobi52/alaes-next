'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

const initialRows = [
  { file: 'LUAC/AB/03517/AB', owner: 'Chinedu Okafor', documents: 12, trackingId: 'TRK-AB-000184', status: 'Grouped' },
  { file: 'LUAC/AB/02894/UM', owner: 'Nwachukwu Emeka', documents: 8, trackingId: 'TRK-AB-000185', status: 'Grouped' },
  { file: 'LUM/02893', owner: 'Obinna Kalu', documents: 5, trackingId: 'TRK-AB-000186', status: 'Ready' },
]

export default function GroupingPage() {
  const [rows, setRows] = useState(initialRows)
  const [query, setQuery] = useState('')
  const visible = rows.filter((row) => `${row.file} ${row.owner} ${row.trackingId}`.toLowerCase().includes(query.toLowerCase()))
  const groupSelected = (file: string) => setRows((current) => current.map((row) => row.file === file ? { ...row, status: 'Grouped', trackingId: row.trackingId || `TRK-AB-${String(current.length + 184).padStart(6, '0')}` } : row))

  return <AppShell title="File SerialNo Grouping" subtitle="DMS / Indexing"><main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"><section className="rounded-xl border bg-card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Grouping table</h2><p className="mt-1 text-sm text-muted-foreground">Group indexed Abia files and assign the Tracking ID used by File Tracking.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file or Tracking ID" className="h-10 w-full max-w-xs rounded-lg border bg-background px-3 text-sm" /></div><div className="mt-6 overflow-x-auto rounded-lg border"><table className="min-w-[850px] w-full text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">File number</th><th className="p-3">Registered party</th><th className="p-3">Documents</th><th className="p-3">Tracking ID</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{visible.map((row) => <tr key={row.file} className="border-t"><td className="p-3 font-mono font-medium text-primary">{row.file}</td><td className="p-3">{row.owner}</td><td className="p-3">{row.documents}</td><td className="p-3 font-mono">{row.trackingId}</td><td className="p-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{row.status}</span></td><td className="p-3"><button type="button" onClick={() => groupSelected(row.file)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{row.status === 'Grouped' ? 'Regroup' : 'Group & assign ID'}</button></td></tr>)}</tbody></table></div></section><section className="rounded-xl border border-primary/20 bg-primary/5 p-5"><p className="text-sm font-semibold">Tracking workflow</p><p className="mt-1 text-sm text-muted-foreground">After grouping, use the generated Tracking ID in File Tracking to log movements, custody, and return status.</p></section></main></AppShell>
}
