import { AppShell } from '@/components/app-shell'

const applications = [
  { id: 'LAAS-AB-2026-0012', applicant: 'Chukwuemeka Nwosu', type: 'Change of Purpose', lga: 'Umuahia North', status: 'Pending Review', submitted: '10 Sep 2026' },
  { id: 'LAAS-AB-2026-0011', applicant: 'Adaeze Okafor', type: 'Title Status Update', lga: 'Aba South', status: 'Assigned', submitted: '09 Sep 2026' },
  { id: 'LAAS-AB-2026-0009', applicant: 'Ifeanyi Umeh', type: 'Parcel Update - New', lga: 'Ohafia', status: 'Approved', submitted: '08 Sep 2026' },
]

export default function LaasAdminPage() {
  return <AppShell title="LAAS Portal Admin" subtitle="ALAES · Land Administration Application Services">
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-3">
        {[['Pending review', '18'], ['Active applicants', '246'], ['Approved this month', '74']].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p></div>)}
      </section>
      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Applications queue</h2><p className="mt-1 text-sm text-muted-foreground">Review and assign Abia LAAS applications.</p></div><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Export queue</button></div>
        <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr>{['Application ID', 'Applicant', 'Application type', 'LGA', 'Status', 'Submitted', 'Action'].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{applications.map((application) => <tr key={application.id} className="hover:bg-muted/20"><td className="px-5 py-4 font-mono text-xs">{application.id}</td><td className="px-5 py-4 font-medium">{application.applicant}</td><td className="px-5 py-4">{application.type}</td><td className="px-5 py-4">{application.lga}</td><td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{application.status}</span></td><td className="px-5 py-4 text-muted-foreground">{application.submitted}</td><td className="px-5 py-4"><button type="button" className="font-medium text-primary hover:underline">Open</button></td></tr>)}</tbody></table></div>
      </section>
    </div>
  </AppShell>
}
