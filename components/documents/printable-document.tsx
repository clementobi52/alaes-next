'use client'

import Image from 'next/image'
import { Download, Printer } from 'lucide-react'

type PrintableDocumentProps = { title: string; subtitle: string; src: string; alt: string }

export function PrintableDocument({ title, subtitle, src, alt }: PrintableDocumentProps) {
  return (
    <main className="min-h-screen bg-muted/40 p-6 text-foreground print:bg-white print:p-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 print:block">
        <header className="flex items-center justify-between gap-4 print:hidden">
          <div><p className="text-sm font-medium uppercase tracking-widest text-primary">ALAES Documents</p><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="text-sm text-muted-foreground">{subtitle}</p></div>
          <div className="flex gap-2"><button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"><Printer className="size-4" />Print / Save PDF</button><a href={src} download className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold"><Download className="size-4" />Download image</a></div>
        </header>
        <section className="overflow-auto rounded-xl border border-border bg-card p-4 shadow-sm print:overflow-visible print:rounded-none print:border-0 print:p-0 print:shadow-none"><Image src={src} alt={alt} width={1600} height={2200} priority className="mx-auto h-auto max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain print:max-h-none print:w-full" /></section>
      </div>
      <style jsx global>{`@media print { @page { size: A4; margin: 0; } body { background: white !important; } }`}</style>
    </main>
  )
}
