'use client'

import { useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'

const files = [
  { number: 'LUAC/AB/03517/AB', owner: 'Chinedu Okafor', location: 'Aba, Abia State', type: 'LUAC' },
  { number: 'LUAC/AB/02894/UM', owner: 'Nwachukwu Emeka', location: 'Umuahia, Abia State', type: 'LUAC' },
  { number: 'LUM/02893', owner: 'Obinna Kalu', location: 'Ohafia, Abia State', type: 'LUM' },
]

export default function PrintFileLabelPage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(files[0])
  const [selectedBatch, setSelectedBatch] = useState<string[]>([files[0].number])
  const matches = useMemo(() => files.filter((file) => `${file.number} ${file.owner} ${file.location}`.toLowerCase().includes(query.toLowerCase())), [query])
  const printBatch = () => {
    const batch = files.filter((file) => selectedBatch.includes(file.number))
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return
    printWindow.document.write(`<html><head><title>Abia State File Labels</title><style>body{font-family:Arial;padding:24px}.sheet{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.label{border:2px dashed #8d1538;padding:22px;break-inside:avoid}.number{font:700 24px monospace;color:#8d1538;margin:18px 0}.muted{color:#555;font-size:12px}</style></head><body><div class="sheet">${batch.map((file) => `<section class="label"><b>ABIA STATE LAND REGISTRY</b><div class="number">${file.number}</div><div>${file.owner}</div><div class="muted">${file.location} · ${file.type}</div></section>`).join('')}</div><script>window.onload=()=>window.print()</script></body></html>`)
    printWindow.document.close()
  }

  return <AppShell title="Print File Label" subtitle="DMS / Indexing / File SerialNo Grouping"><main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6"><section className="rounded-xl border bg-card p-6"><h2 className="text-lg font-semibold">Select indexed file</h2><p className="mt-1 text-sm text-muted-foreground">Generate an Abia State label for an indexed physical file.</p><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file number or owner" className="mt-5 h-10 w-full rounded-lg border bg-background px-3 text-sm" /><div className="mt-4 grid gap-2">{matches.map((file) => <button key={file.number} type="button" onClick={() => { setSelected(file); setSelectedBatch((current) => current.includes(file.number) ? current.filter((number) => number !== file.number) : [...current, file.number]) }} className={`flex items-center justify-between rounded-lg border p-4 text-left ${selectedBatch.includes(file.number) ? 'border-primary bg-primary/5' : 'bg-background'}`}><span><span className="block font-mono text-sm font-semibold text-primary">{file.number}</span><span className="block text-sm">{file.owner}</span><span className="block text-xs text-muted-foreground">{file.location}</span></span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{file.type}</span></button>)}</div></section><section className="rounded-xl border bg-card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">Label preview</p><h2 className="mt-1 text-xl font-semibold">{selected.number}</h2></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => window.print()} className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary">Print selected ({selectedBatch.length})</button><button type="button" onClick={printBatch} disabled={selectedBatch.length === 0} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Print batch ({selectedBatch.length})</button></div></div><div className="mt-6 max-w-xl border-2 border-dashed border-primary/40 bg-background p-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Abia State Land Registry</p><p className="mt-5 font-mono text-3xl font-bold tracking-wider text-primary">{selected.number}</p><div className="mt-5 grid gap-1 text-sm"><p><span className="text-muted-foreground">Registered party:</span> {selected.owner}</p><p><span className="text-muted-foreground">Location:</span> {selected.location}</p><p><span className="text-muted-foreground">Document class:</span> {selected.type}</p></div><div className="mt-6 h-12 border-y border-dashed border-muted-foreground/40 pt-2 text-center font-mono text-xs tracking-[0.35em]">{selected.number.replaceAll('/', ' ')}</div></div></section></main></AppShell>
}
