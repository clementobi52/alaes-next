import { AppShell } from '@/components/app-shell'

const products = [
  { name: 'Letter of Grant / RofO', code: 'ROFO-AB-2026-0184', applicant: 'Chiamaka Eze', lga: 'Umuahia North', status: 'Ready for review' },
  { name: 'Occupancy Permit (OP)', code: 'OP-AB-2026-0087', applicant: 'Emeka Nwankwo', lga: 'Aba South', status: 'In production' },
  { name: 'Site Plan / Parcel Plan', code: 'SP-AB-2026-0041', applicant: 'Adaobi Okoro', lga: 'Ikwuano', status: 'Awaiting survey' },
  { name: 'Certificate of Occupancy', code: 'CofO-AB-2026-0029', applicant: 'Ifeanyi Umeh', lga: 'Ohafia', status: 'Pending approval' },
]

export default function InformationProductsPage() {
  return <AppShell title="Information Products" subtitle="RofO · Abia State land documents">
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-4">{[['RofO applications', '42'], ['OP requests', '18'], ['Site plans', '27'], ['CofO requests', '11']].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</section>
      <section className="rounded-xl border border-border bg-card"><div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Information product requests</h2><p className="mt-1 text-sm text-muted-foreground">Manage Abia RofO, OP, site plan, and CofO production.</p></div><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create request</button></div><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr>{['Product', 'Reference', 'Applicant', 'LGA', 'Status', 'Action'].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{products.map((product) => <tr key={product.code} className="hover:bg-muted/20"><td className="px-5 py-4 font-medium">{product.name}</td><td className="px-5 py-4 font-mono text-xs">{product.code}</td><td className="px-5 py-4">{product.applicant}</td><td className="px-5 py-4">{product.lga}</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{product.status}</span></td><td className="px-5 py-4"><button type="button" className="font-medium text-primary hover:underline">Open</button></td></tr>)}</tbody></table></div></section>
    </div>
  </AppShell>
}
