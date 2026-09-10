'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

const initialFiles = [
  { file: 'MLS/AB/2026/00041', applicant: 'Ifeoma Eze', lga: 'Umuahia North', purpose: 'Residential', status: 'Pending Commissioning' },
  { file: 'MLS/AB/2026/00042', applicant: 'Aba Industrial Ventures Ltd', lga: 'Osisioma Ngwa', purpose: 'Industrial', status: 'Pending Commissioning' },
  { file: 'MLS/AB/2026/00043', applicant: 'Chukwudi Okoro', lga: 'Aba South', purpose: 'Commercial', status: 'Commissioned' },
]

export default function LandCommissioningPage() {
  const [files, setFiles] = useState(initialFiles)
  const [query, setQuery] = useState('')
  const visible = files.filter((file) => `${file.file} ${file.applicant} ${file.lga}`.toLowerCase().includes(query.toLowerCase()))
  const commission = (fileNumber: string) => setFiles((current) => current.map((file) => file.file === fileNumber ? { ...file, status: 'Commissioned' } : file))

  return <AppShell title="Land File Commissioning" subtitle="Land / File Management"><main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"><section className="rounded-xl border bg-card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Commission land files</h2><p className="mt-1 text-sm text-muted-foreground">Review Abia State land applications and commission approved files into the land registry.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file, applicant or LGA" className="h-10 w-full max-w-xs rounded-lg border bg-background px-3 text-sm" /></div><div className="mt-6 overflow-x-auto rounded-lg border"><table className="min-w-[850px] w-full text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-3">MLS file number</th><th className="p-3">Applicant</th><th className="p-3">LGA</th><th className="p-3">Purpose</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{visible.map((file) => <tr key={file.file} className="border-t"><td className="p-3 font-mono font-medium text-primary">{file.file}</td><td className="p-3">{file.applicant}</td><td className="p-3">{file.lga}</td><td className="p-3">{file.purpose}</td><td className="p-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{file.status}</span></td><td className="p-3"><button type="button" disabled={file.status === 'Commissioned'} onClick={() => commission(file.file)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{file.status === 'Commissioned' ? 'Commissioned' : 'Commission file'}</button></td></tr>)}</tbody></table></div></section></main></AppShell>
}
