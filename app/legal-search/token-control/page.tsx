import { AppShell } from '@/components/app-shell'

const tokens = [
  { token: 'TKN-8F31', requester: 'Uche & Co.', reference: 'LUAC/AB/00127/AB', purpose: 'Official legal search', units: '1', status: 'Active', issued: 'Today, 10:42' },
  { token: 'TKN-8F29', requester: 'Walk-in applicant', reference: 'LABA/08731', purpose: 'On-premise search', units: '1', status: 'Consumed', issued: 'Today, 09:18' },
  { token: 'TKN-8E88', requester: 'A. Okoro', reference: 'LUM/02670', purpose: 'Official legal search', units: '1', status: 'Reserved', issued: 'Yesterday, 15:34' },
]

export default function TokenControlPage() {
  return <AppShell title="Legal Search Token Control" subtitle="Legal Search · Abia State transaction tokens">
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-4">{[['Issued today', '126'], ['Active tokens', '38'], ['Consumed', '81'], ['Available balance', '442']].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</section>
      <section className="rounded-xl border border-border bg-card"><div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Token ledger</h2><p className="mt-1 text-sm text-muted-foreground">Issue, reserve, and reconcile Legal Search tokens.</p></div><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Issue token</button></div><div className="overflow-x-auto"><table className="min-w-[1000px] w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr>{['Token', 'Requester', 'File number', 'Purpose', 'Units', 'Status', 'Issued', 'Action'].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{tokens.map((item) => <tr key={item.token} className="hover:bg-muted/20"><td className="px-5 py-4 font-mono text-xs">{item.token}</td><td className="px-5 py-4">{item.requester}</td><td className="px-5 py-4 font-mono text-xs">{item.reference}</td><td className="px-5 py-4">{item.purpose}</td><td className="px-5 py-4">{item.units}</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{item.status}</span></td><td className="px-5 py-4 text-muted-foreground">{item.issued}</td><td className="px-5 py-4"><button type="button" className="font-medium text-primary hover:underline">Open</button></td></tr>)}</tbody></table></div></section>
    </div>
  </AppShell>
}
