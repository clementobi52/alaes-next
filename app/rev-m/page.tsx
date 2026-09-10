'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'

const sections = ['Billing', 'Automated Billing', 'Legacy Billing', 'Generate Receipt', 'Land Use Charge (LUC)', 'Transaction Token Control'] as const
type Section = (typeof sections)[number]

const sample = {
  fileNumber: 'LUAC/AB/00501/AB',
  payer: 'KORAMA COVERS INDUSTRIES LIMITED',
  assessment: '00501',
  amount: 18125,
  bank: 'First Bank Nigeria',
  paymentId: '2',
}

function ReceiptPreview() {
  return <div className="receipt-paper space-y-4 text-xs">
    <div className="flex items-center justify-between border-b pb-3"><div className="text-center font-bold text-[#087f45]">ABIA STATE GEOGRAPHIC INFORMATION SYSTEM (ABIAGIS)</div><span className="font-bold text-red-700">ORIGINAL</span></div>
    <div className="grid grid-cols-2 gap-2 border-b pb-3"><span>File Number: <b>{sample.fileNumber}</b></span><span>Payment Date: <b>15-May-2026</b></span><span>Payment ID: <b>{sample.paymentId}</b></span><span>Assessment Number: <b>{sample.assessment}</b></span></div>
    <p>Received from <b>{sample.payer}</b> the sum of <b>NGN {sample.amount.toLocaleString()}</b> being payment for Land Use Charge.</p>
    <div className="flex justify-between border-y py-4 text-[10px]"><span>Signature or mark of payer</span><span>Signature of revenue collector</span></div>
    <p className="text-center font-bold text-red-700">NO REFUND OF MONEY AFTER PAYMENT</p>
    <div className="receipt-divider" />
    <div className="flex items-center justify-between border-b pb-3"><div className="text-center font-bold text-[#087f45]">MINISTRY OF LANDS AND SURVEY<br />ABIA STATE GOVERNMENT</div><span className="font-bold text-red-700">COPY</span></div>
    <div className="grid grid-cols-2 gap-2"><span>File Number: <b>{sample.fileNumber}</b></span><span>Receipt Date: <b>15-May-2026</b></span><span>Payment ID: <b>{sample.paymentId}</b></span><span>Bank: <b>{sample.bank}</b></span></div>
    <p className="text-center font-mono text-lg tracking-[0.35em]">|||| |||| ||| ||||||</p>
  </div>
}

export default function RevMPage() {
  const [section, setSection] = useState<Section>('Billing')
  const [payer, setPayer] = useState(sample.payer)
  const [amount, setAmount] = useState(String(sample.amount))
  const [token, setToken] = useState('REV-AB-2026-000184')
  const [message, setMessage] = useState('')
  const total = useMemo(() => Number(amount || 0), [amount])
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get('view')
    const viewMap: Record<string, Section> = { automated: 'Automated Billing', legacy: 'Legacy Billing', receipt: 'Generate Receipt', luc: 'Land Use Charge (LUC)', tokens: 'Transaction Token Control' }
    if (view && viewMap[view]) setSection(viewMap[view])
  }, [])

  return <AppShell title="ALAES REV-M" subtitle="Revenue management and payment control">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-xl border bg-card p-5"><div className="flex flex-wrap gap-2">{sections.map((item) => <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${section === item ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`} aria-current={section === item ? 'page' : undefined}>{item}</button>)}</div></section>
      {(section === 'Billing' || section === 'Automated Billing' || section === 'Legacy Billing') && <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-xl border bg-card p-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">{section === 'Legacy Billing' ? 'Legacy Billing' : 'Automated Billing'}</p><h1 className="mt-2 text-2xl font-semibold text-balance">Create a Land Use Charge assessment</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Generate a controlled assessment for an indexed land record, then issue a receipt and transaction token.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Registered party<input className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={payer} onChange={(event) => setPayer(event.target.value)} /></label><label className="block text-sm font-medium">Amount<input className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} /></label><label className="block text-sm font-medium">File number<input className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={sample.fileNumber} readOnly /></label><label className="block text-sm font-medium">Assessment number<input className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" value={sample.assessment} readOnly /></label></div><button type="button" onClick={() => setMessage(`Assessment created for ${payer}: NGN ${total.toLocaleString()}`)} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create assessment</button>{message && <p role="status" className="mt-3 text-sm text-primary">{message}</p>}</div><aside className="rounded-xl border bg-card p-6"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment summary</p><p className="mt-5 text-3xl font-semibold">NGN {total.toLocaleString()}</p><p className="mt-2 text-sm text-muted-foreground">Land Use Charge (LUC)</p><div className="mt-6 border-t pt-4 text-sm"><div className="flex justify-between"><span>Status</span><b className="text-amber-600">Draft</b></div><div className="mt-3 flex justify-between"><span>Payment channel</span><span>Bank / POS</span></div></div></aside></section>}
      {section === 'Generate Receipt' && <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><div className="rounded-xl border bg-card p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Generate Receipt</p><h2 className="mt-2 text-2xl font-semibold">Revenue collector receipt</h2></div><button type="button" onClick={() => window.print()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Print receipt</button></div><div className="mt-6"><ReceiptPreview /></div></div><aside className="rounded-xl border bg-card p-6"><h3 className="font-semibold">Receipt controls</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Preview the original and copy sections before printing the official simulation receipt.</p><button type="button" onClick={() => setMessage('Receipt marked ready for printing.')} className="mt-5 w-full rounded-lg border px-4 py-2 text-sm font-semibold">Mark ready</button></aside></section>}
      {section === 'Land Use Charge (LUC)' && <section className="rounded-xl border bg-card p-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Land Use Charge (LUC)</p><h2 className="mt-2 text-2xl font-semibold">Charge configuration</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-lg bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Base assessment</p><p className="mt-2 text-xl font-semibold">NGN {total.toLocaleString()}</p></div><div className="rounded-lg bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Assessment number</p><p className="mt-2 font-mono font-semibold">{sample.assessment}</p></div><div className="rounded-lg bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Charge status</p><p className="mt-2 font-semibold text-amber-600">Pending payment</p></div></div><button type="button" onClick={() => setMessage('LUC assessment recalculated successfully.')} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Recalculate charge</button></section>}
      {section === 'Transaction Token Control' && <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-xl border bg-card p-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Transaction Token Control</p><h2 className="mt-2 text-2xl font-semibold">Issue and validate payment tokens</h2><label className="mt-6 block text-sm font-medium">Transaction token<input className="input mt-2 font-mono" value={token} onChange={(event) => setToken(event.target.value)} /></label><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setMessage(`Token ${token} validated.`)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Validate token</button><button type="button" onClick={() => setMessage(`Token ${token} revoked.`)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Revoke token</button></div>{message && <p role="status" className="mt-4 text-sm text-primary">{message}</p>}</div><aside className="rounded-xl border bg-card p-6"><p className="text-xs uppercase tracking-widest text-muted-foreground">Token status</p><p className="mt-3 text-2xl font-semibold text-emerald-600">Active</p><p className="mt-2 text-sm text-muted-foreground">Single-use token linked to assessment {sample.assessment}.</p></aside></section>}
    </div>
  </AppShell>
}
