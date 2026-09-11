'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Camera, FileText } from 'lucide-react'
import { AppShell } from '@/components/app-shell'

const demoFiles = ['LUAC/AB/3518/AB', 'LUAC/AB/2894/UM', 'LUM/2893', 'LABA/2892', 'LUM/OH/2891']

export default function DmsUpdatePage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'type' ? 'type' : 'scan'
  const mode = initialMode
  const [fileNumber, setFileNumber] = useState(demoFiles[0])
  const [pages, setPages] = useState<File[]>([])
  const [saved, setSaved] = useState(false)

  return (
    <AppShell
      title={mode === 'scan' ? 'Scan More' : 'Type More Pages'}
      subtitle="DMS · Document Management System"
    >
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">DMS Update</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{mode === 'scan' ? 'Scan More' : 'More Pages'}</h1>
        <p className="mt-2 text-muted-foreground">{mode === 'scan' ? 'Add additional scanned pages to an existing Abia State file.' : 'Continue page typing for an existing Abia State file.'}</p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3"><div className="rounded-lg bg-primary/10 p-3 text-primary">{mode === 'scan' ? <Camera className="size-5" /> : <FileText className="size-5" />}</div><div><h2 className="text-xl font-semibold">{mode === 'scan' ? 'Scan More Pages' : 'Type More Pages'}</h2><p className="mt-1 text-sm text-muted-foreground">{mode === 'scan' ? 'Select the file and upload additional scanned pages.' : 'Select the file and continue classifying and typing its pages.'}</p></div></div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold">File Number<select value={fileNumber} onChange={(event) => setFileNumber(event.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 font-mono text-sm font-normal">{demoFiles.map((item) => <option key={item}>{item}</option>)}</select><span className="text-xs font-normal text-muted-foreground">Abia State file nomenclature</span></label>
          {mode === 'scan' ? <label className="flex flex-col gap-2 text-sm font-semibold">Additional Pages<input type="file" multiple accept="image/*,.pdf" onChange={(event) => { setPages(Array.from(event.target.files ?? [])); setSaved(false) }} className="h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal" /><span className="text-xs font-normal text-muted-foreground">Upload A4/A3 scanned pages for this file.</span></label> : <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4"><p className="text-sm font-semibold">Typing queue</p><p className="mt-1 text-sm text-muted-foreground">Pages already scanned for {fileNumber} will appear in Page Typing.</p><a href={`/dms/page-typing?file=${encodeURIComponent(fileNumber)}`} className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open Page Typing</a></div>}
        </div>
        {mode === 'scan' && <div className="mt-5 rounded-lg border border-border bg-muted/40 p-4 text-sm">{pages.length ? <span className="font-medium text-primary">{pages.length} page(s) selected for {fileNumber}.</span> : <span className="text-muted-foreground">No additional pages selected.</span>}</div>}
        {mode === 'scan' && <button type="button" disabled={!pages.length} onClick={() => setSaved(true)} className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">Add Pages to File</button>}
        {saved && <p className="mt-4 text-sm font-medium text-primary">Additional pages queued for {fileNumber}.</p>}
      </section>
    </div>
    </AppShell>
  )
}
