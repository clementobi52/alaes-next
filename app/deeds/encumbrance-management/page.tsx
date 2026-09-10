import { AppShell } from '@/components/app-shell'

const records = [
  { reference: 'LABA/10482', type: 'Caveat', party: 'Ngozi Adaeze', amount: '—', status: 'Active', updated: '10 Sep 2026' },
  { reference: 'LUM/1854', type: 'Mortgage', party: 'First Abia Bank Plc', amount: '₦18,500,000', status: 'Pending registration', updated: '09 Sep 2026' },
  { reference: 'LUAC/AB/00127/AB', type: 'Surrender & Release', party: 'Emeka Uche', amount: '—', status: 'Released', updated: '08 Sep 2026' },
  { reference: 'LUM/OH/00319', type: 'Lien', party: 'Abia Development Fund', amount: '₦4,200,000', status: 'Active', updated: '07 Sep 2026' },
]

export default function EncumbranceManagementPage() {
  return <AppShell title="Encumbrance Management" subtitle="Deeds · Abia State property restrictions and interests">
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-4">{[['Active caveats', '12'], ['Mortgages', '28'], ['Pending releases', '7'], ['Active liens', '9']].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</section>
      <section className="rounded-xl border border-border bg-card"><div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Encumbrance register</h2><p className="mt-1 text-sm text-muted-foreground">Search and manage caveats, mortgages, releases, and liens.</p></div><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create encumbrance</button></div><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr>{['File number', 'Type', 'Interested party', 'Amount', 'Status', 'Updated', 'Action'].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{records.map((record) => <tr key={`${record.reference}-${record.type}`} className="hover:bg-muted/20"><td className="px-5 py-4 font-mono text-xs">{record.reference}</td><td className="px-5 py-4 font-medium">{record.type}</td><td className="px-5 py-4">{record.party}</td><td className="px-5 py-4">{record.amount}</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{record.status}</span></td><td className="px-5 py-4 text-muted-foreground">{record.updated}</td><td className="px-5 py-4"><button type="button" className="font-medium text-primary hover:underline">Open</button></td></tr>)}</tbody></table></div></section>
    </div>
  </AppShell>
}
