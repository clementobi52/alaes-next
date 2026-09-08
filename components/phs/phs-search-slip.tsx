'use client'

import { Printer } from 'lucide-react'
import { Modal } from '@/components/system-admin/primitives'

type SlipRecord = {
  id: string | number
  fileNo: string
  property?: string
  owner?: string
  lga?: string
  district?: string
  location?: string
  status?: string
  propertyId?: string
  grantor?: string
  grantee?: string
  scheduleName?: string
  layoutName?: string
  plotNumber?: string
  plotSize?: string
  approved?: string
  transactionType?: string
  registrationNumber?: string
  parentRegistration?: string
  planNumber?: string
  propertyDescription?: string
  landUse?: string
  address?: string
  created?: string
  caveat?: string
  history?: Array<{
    id?: string | number
    fileNo?: string
    transactionType?: string
    grantor?: string
    grantee?: string
    instrumentDate?: string
    registrationDate?: string
    registrationNumber?: string
    parentRegistration?: string
    propertyDescription?: string
  }>
}

export function PhsSearchSlip({ record, onClose }: { record: SlipRecord; onClose: () => void }) {
  const fileNumber = formatAbiaFileNumber(record.fileNo)
  const caveat = record.caveat && !['no', 'none', 'nil', '—'].includes(record.caveat.trim().toLowerCase()) ? 'YES' : 'NO'
  const transactions = [...(record.history ?? [])].sort((a, b) => {
    const left = new Date(a.instrumentDate ?? a.registrationDate ?? '').getTime()
    const right = new Date(b.instrumentDate ?? b.registrationDate ?? '').getTime()
    return (Number.isFinite(left) ? left : Number(a.id) || 0) - (Number.isFinite(right) ? right : Number(b.id) || 0)
  })
  const searchDate = new Date().toLocaleDateString('en-GB')
  const referenceNumber = `PHS/${new Date().getFullYear()}/${String(record.id).slice(-6)}`

  return (
    <Modal
      open
      onClose={onClose}
      title="PHS Search Slip Preview"
      widthClass="max-w-[95vw]"
      printable
      footer={<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Close</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" /> Print slip</button></div>}
    >
      <article className="phs-search-slip mx-auto w-[8.27in] [page:phs-slip] max-w-full overflow-hidden bg-card font-serif text-[11px] text-foreground shadow-sm print:w-full print:max-w-none print:shadow-none">
        <header className="border-b-4 border-primary px-[0.42in] pb-4 pt-5">
          <div className="flex items-center justify-between gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white p-1"><img src="/images/abiagis-emblem.png" alt="ABIAGIS emblem" className="h-full w-full object-contain" /></div>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-[17px] font-black uppercase leading-tight tracking-wide text-primary">Abia State Ministry of Lands</p>
              <p className="text-[17px] font-black uppercase leading-tight tracking-wide text-primary">and Housing</p>
              <p className="mt-2 text-[12px] font-semibold uppercase">Property History Search Slip (Certified Copy)</p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white p-1"><img src="/images/abia-state--logo.png" alt="Abia State coat of arms" className="h-full w-full object-contain" /></div>
          </div>
        </header>

        <main className="px-[0.42in] pb-6 pt-6">
          <div className="grid grid-cols-2 gap-6">
            <SlipCard title="Property Information">
              <SlipRow label="File Number" value={fileNumber} />
              <SlipRow label="ABIAGIS File No." value={record.propertyId} />
              <SlipRow label="Current Grantor" value={record.grantor ?? 'Abia State Government'} />
              <SlipRow label="Current Grantee" value={record.grantee ?? record.owner} />
              <SlipRow label="LGA" value={record.lga ?? record.location} />
              <SlipRow label="Plot Number" value={record.plotNumber} />
              <SlipRow label="Property Type" value={record.landUse ?? record.property} />
              <SlipRow label="Status" value={record.status ?? 'Active'} positive />
            </SlipCard>
            <SlipCard title="Search Details">
              <SlipRow label="Search Reference" value={referenceNumber} />
              <SlipRow label="Search Date" value={searchDate} />
              <SlipRow label="Institution" value="PHS Portal" />
              <SlipRow label="Token ID" value={`PHS-${String(record.id).slice(-6)}`} />
              <SlipRow label="Tokens Consumed" value="1" />
              <SlipRow label="Caveat" value={caveat} positive={caveat === 'NO'} negative={caveat === 'YES'} />
            </SlipCard>
          </div>

          <section className="mt-9 overflow-visible pl-2">
            <SectionTitle>Transaction Timeline</SectionTitle>
            {transactions.length ? <div className="mt-7 space-y-6 border-l-2 border-primary pl-7">
              {transactions.map((transaction, index) => <div key={`${transaction.id ?? transaction.fileNo ?? 'transaction'}-${index}`} className="relative break-inside-avoid">
                <span className="absolute -left-[2.2rem] top-0 h-3 w-3 rounded-full border-2 border-primary bg-card" />
                <div className="flex items-baseline gap-5"><strong className="text-[12px] text-primary">{transaction.transactionType ?? 'Property transaction'}</strong><span className="text-[10px]">{transaction.instrumentDate ?? transaction.registrationDate ?? 'Date not recorded'}</span></div>
                <div className="mt-4 grid grid-cols-[1fr_32px_1fr] items-start gap-3">
                  <div><p className="text-[9px] uppercase">From</p><strong className="text-[11px]">{transaction.grantor ?? 'Abia State Government'}</strong></div>
                  <span className="pt-2 text-center text-lg text-muted-foreground">→</span>
                  <div><p className="text-[9px] uppercase">To</p><strong className="text-[11px]">{transaction.grantee ?? record.grantee ?? 'Not recorded'}</strong></div>
                </div>
                <p className="mt-3 border-t border-border pt-2 text-[10px]">{transaction.propertyDescription ?? transaction.registrationNumber ?? transaction.parentRegistration ?? 'Transaction recorded in the Abia State property register.'}</p>
              </div>)}
            </div> : <p className="mt-6 border-l-2 border-primary py-2 pl-7 text-[10px] text-muted-foreground">No transaction records found.</p>}
          </section>

          <footer className="mt-12 border-t border-border pt-5 text-center">
            <p className="text-[10px]">This is an electronically generated official search slip. Verification can be made through the Abia State PHS Portal.</p>
            <p className="font-bold">STATUS: CERTIFIED VERIFIED ✓</p>
            <div className="ml-auto mt-9 w-2/5 border-t border-foreground pt-2 text-[10px]"><p>Authorized Signatory</p><p>Abia State Land Administration</p></div>
          </footer>
        </main>
      </article>
    </Modal>
  )
}

function SlipCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-border px-5 py-4"><h2 className="mb-4 inline-block border-b-2 border-primary pb-2 text-[13px] font-black uppercase text-primary">{title}</h2><div className="space-y-2">{children}</div></section>
}

function SlipRow({ label, value, positive = false, negative = false }: { label: string; value?: string; positive?: boolean; negative?: boolean }) {
  return <div className="grid grid-cols-[1fr_1.2fr] gap-3 leading-tight"><span>{label}:</span><strong className={positive ? 'text-emerald-600' : negative ? 'text-destructive' : undefined}>{value || 'Not recorded'}</strong></div>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="inline-block border-b-2 border-primary pb-2 text-[15px] font-black uppercase text-primary">{children}</h2>
}

function formatAbiaFileNumber(value: string) {
  const cleaned = value.trim()
  if (!cleaned || cleaned === '—') return 'ABIA/PHS/NOT-RECORDED'
  if (/^ABIA\//i.test(cleaned)) return cleaned.toUpperCase()
  return `ABIA/PHS/${cleaned.toUpperCase()}`
}
