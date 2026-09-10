'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, FileText, Landmark, ReceiptText, ShieldCheck } from 'lucide-react'

type View = 'billing' | 'automated' | 'legacy' | 'receipt' | 'luc' | 'tokens'

const views: Array<{ id: View; label: string; icon: typeof Landmark }> = [
  { id: 'billing', label: 'Billing', icon: Landmark },
  { id: 'automated', label: 'Automated Billing', icon: ReceiptText },
  { id: 'legacy', label: 'Legacy Billing', icon: FileText },
  { id: 'receipt', label: 'Generate Receipt', icon: ReceiptText },
  { id: 'luc', label: 'Land Use Charge (LUC)', icon: Landmark },
  { id: 'tokens', label: 'Transaction Token Control', icon: ShieldCheck },
]

const payer = { name: 'KORAMA COVERS INDUSTRIES LIMITED', file: 'LUAC/AB/00501/AB', location: 'Aba South, Abia State' }

function Receipt({ copy = false }: { copy?: boolean }) {
  return <article className="receipt-paper space-y-4 text-[11px] leading-relaxed">
    <div className="flex items-center justify-between border-b border-black pb-3">
      <div className="grid size-12 place-items-center rounded-full border-2 border-[#168044] text-center text-[7px] font-bold text-[#168044]">ABIA<br />GIS</div>
      <div className="text-center"><p className="font-bold text-[#0874a5]">ABIA STATE GEOGRAPHIC INFORMATION SYSTEM (ABIAGIS)</p><p className="font-bold text-red-600">{copy ? 'COPY' : 'ORIGINAL'}</p></div>
      <div className="grid size-12 place-items-center rounded-full border-2 border-red-600 text-center text-[7px] font-bold text-red-600">ABIA<br />STATE</div>
    </div>
    <div className="grid grid-cols-2 gap-2 border border-black p-2"><span>File Number: <b>{payer.file}</b></span><span>Payment Date: <b>10-Sep-2026</b></span><span>Payment ID: <b>2</b></span><span>Receipt Date: <b>10-Sep-2026</b></span><span>Assessment Number: <b>00501</b></span><span>Bank: <b>REV-M SIMULATION</b></span></div>
    <div>Received from <b>{payer.name}</b><br />the sum of <b>NGN 18,125.00</b><br />being payment for Land Use Charge and related revenue.</div>
    <div className="flex justify-between border-y border-black py-3"><span>Signature or mark of payer</span><span>Signature of revenue collector</span></div>
    <p className="text-center font-bold">NO REFUND OF MONEY AFTER PAYMENT</p>
    <div className="flex items-end justify-between border-t border-black pt-3"><span className="font-bold text-red-600">REVENUE COLLECTOR&apos;S RECEIPT</span><span className="barcode">▌▌▌▌ ▌▌ ▌▌▌▌</span></div>
  </article>
}

export default function RevMPage() {
  const [view, setView] = useState<View>('billing')
  const [fileNumber, setFileNumber] = useState(payer.file)
  const [amount, setAmount] = useState('18125')
  const [token, setToken] = useState('LUC-AB-2026-00501')
  const [issued, setIssued] = useState(false)
  const selected = useMemo(() => views.find((item) => item.id === view) ?? views[0], [view])
  const charge = Number(amount || 0)
  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get('view') as View | null
    if (requestedView && views.some((item) => item.id === requestedView)) setView(requestedView)
  }, [])

  return <main className="min-h-screen bg-background text-foreground"><header className="border-b bg-card"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">ALAES REV-M</p><h1 className="text-xl font-semibold tracking-tight">Revenue and assessment management</h1></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500" /> Simulation mode</div></div></header><div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="rounded-xl border bg-card p-3"><p className="px-3 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Billing</p><nav className="space-y-1">{views.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${view === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-4" />{item.label}</button> })}</nav></aside><section className="min-w-0 space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">ALAES REV-M / Billing</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">{selected.label}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Create, review, and control Abia State Land Use Charge revenue transactions.</p></div>{(view === 'receipt' || view === 'billing') && <button type="button" onClick={() => window.print()} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Print receipt</button>}</div>{(view === 'billing' || view === 'automated' || view === 'luc') && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="rounded-xl border bg-card p-5"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">File number<input className="input mt-2" value={fileNumber} onChange={(event) => setFileNumber(event.target.value)} /></label><label className="text-sm font-medium">Payer<input className="input mt-2" value={payer.name} readOnly /></label><label className="text-sm font-medium">Charge amount (NGN)<input className="input mt-2" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} /></label><label className="text-sm font-medium">Assessment year<select className="input mt-2"><option>2026</option><option>2025</option></select></label></div><div className="mt-6 flex items-center justify-between rounded-lg bg-muted p-4"><div><p className="text-sm font-semibold">Ready for receipt</p><p className="text-xs text-muted-foreground">File and amount will be carried into the receipt.</p></div><button type="button" onClick={() => setView('receipt')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Generate receipt <ArrowRight className="size-4" /></button></div></div><aside className="rounded-xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assessment summary</p><p className="mt-4 text-3xl font-semibold">NGN {charge.toLocaleString('en-NG')}.00</p><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Land Use Charge</span><b>NGN {charge.toLocaleString('en-NG')}</b></div><div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-emerald-600">Ready</span></div></div></aside></div>}{view === 'receipt' && <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"><div className="space-y-4"><Receipt /><Receipt copy /></div><aside className="rounded-xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Receipt controls</p><div className="mt-5 space-y-4"><label className="block text-sm font-medium">File number<input className="input mt-2" value={fileNumber} onChange={(event) => setFileNumber(event.target.value)} /></label><button type="button" onClick={() => window.print()} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Print original and copy</button></div></aside></div>}{view === 'legacy' && <div className="rounded-xl border bg-card p-6"><p className="text-sm text-muted-foreground">Legacy Billing</p><h3 className="mt-2 text-xl font-semibold">Review historic revenue records</h3><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs uppercase text-muted-foreground"><tr><th className="p-3">Receipt</th><th className="p-3">Payer</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead><tbody><tr className="border-b"><td className="p-3 font-mono">RC-00501</td><td className="p-3">{payer.name}</td><td className="p-3">NGN 18,125</td><td className="p-3 text-emerald-600">Archived</td></tr></tbody></table></div></div>}{view === 'tokens' && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Transaction Token Control</p><h3 className="mt-2 text-xl font-semibold">Issue and validate payment tokens</h3><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setIssued(true)} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Issue token</button><button type="button" onClick={() => setIssued(false)} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Revoke token</button></div></div><aside className="rounded-xl border bg-card p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Token status</p><p className="mt-4 font-mono text-lg font-semibold">{token}</p><p className={`mt-3 inline-flex items-center gap-2 text-sm ${issued ? 'text-emerald-600' : 'text-muted-foreground'}`}><CheckCircle2 className="size-4" />{issued ? 'Active and valid' : 'Pending issue'}</p></aside></div>}</section></div></main>
}
