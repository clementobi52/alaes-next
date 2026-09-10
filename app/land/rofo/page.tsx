'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

const initialApplications = [
  { file: 'MLS/AB/2026/00041', applicant: 'Ifeoma Eze', lga: 'Umuahia North', parcel: 'Plot 18, GRA', stage: 'Recommendation', status: 'Pending' },
  { file: 'MLS/AB/2026/00042', applicant: 'Aba Industrial Ventures Ltd', lga: 'Osisioma Ngwa', parcel: 'Industrial Layout', stage: 'RofO Draft', status: 'In Review' },
  { file: 'MLS/AB/2026/00039', applicant: 'Chukwudi Okoro', lga: 'Aba South', parcel: 'Plot 7, Eziukwu', stage: 'Issued', status: 'Complete' },
]

const stages = ['Recommendation', 'RofO Draft', 'Approval', 'Issued']

export default function RofOPage() {
  const [applications, setApplications] = useState(initialApplications)
  const [query, setQuery] = useState('')
  const visible = applications.filter((item) => `${item.file} ${item.applicant} ${item.lga}`.toLowerCase().includes(query.toLowerCase()))
  const advance = (file: string) => setApplications((current) => current.map((item) => { if (item.file !== file) return item; const next = Math.min(stages.indexOf(item.stage) + 1, stages.length - 1); return { ...item, stage: stages[next], status: next === stages.length - 1 ? 'Complete' : 'In Review' } }))

  return <AppShell title="Letter of Grant (RofO)" subtitle="Land / Letter of Grant"><main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"><section className="rounded-xl border bg-card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">RofO application workflow</h2><p className="mt-1 text-sm text-muted-foreground">Process Abia State land applications from recommendation through issuance of the Right of Occupancy.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file, applicant or LGA" className="h-10 w-full max-w-xs rounded-lg border bg-background px-3 text-sm" /></div><div className="mt-6 overflow-x-auto rounded-lg border"><table className="min-w-[1000px] w-full text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">MLS file</th><th className="p-3">Applicant</th><th className="p-3">LGA / parcel</th><th className="p-3">Stage</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{visible.map((item) => <tr key={item.file} className="border-t"><td className="p-3 font-mono font-medium text-primary">{item.file}</td><td className="p-3">{item.applicant}</td><td className="p-3">{item.lga}<span className="block text-xs text-muted-foreground">{item.parcel}</span></td><td className="p-3"><div className="flex items-center gap-1">{stages.map((stage) => <span key={stage} className={`h-2 w-10 rounded-full ${stages.indexOf(stage) <= stages.indexOf(item.stage) ? 'bg-primary' : 'bg-muted'}`} title={stage} />)}</div><span className="mt-1 block text-xs text-muted-foreground">{item.stage}</span></td><td className="p-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{item.status}</span></td><td className="p-3"><button type="button" disabled={item.stage === 'Issued'} onClick={() => advance(item.file)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{item.stage === 'Issued' ? 'Issued' : 'Advance stage'}</button></td></tr>)}</tbody></table></div></section></main></AppShell>
}
