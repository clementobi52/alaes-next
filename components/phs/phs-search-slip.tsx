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
}

export function PhsSearchSlip({ record, onClose }: { record: SlipRecord; onClose: () => void }) {
  const fileNumber = formatAbiaFileNumber(record.fileNo)
  const caveat = record.caveat && !['no', 'none', 'nil', '—'].includes(record.caveat.trim().toLowerCase()) ? 'YES' : 'NO'

  return (
    <Modal
      open
      onClose={onClose}
      title="PHS Search Slip Preview"
      widthClass="max-w-[95vw]"
      printable
      footer={<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Close</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" /> Print slip</button></div>}
    >
      <article className="phs-search-slip mx-auto w-[8.27in] max-w-full overflow-visible bg-card px-[0.35in] py-[0.25in] text-foreground shadow-sm print:w-full print:max-w-none print:shadow-none">
        <header className="border-b-2 border-foreground pb-3">
          <div className="flex items-center justify-between gap-4">
            <img src="/images/abiagis-emblem.png" alt="ABIAGIS emblem" className="h-16 w-16 object-contain" />
            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-wide text-primary">ABIA STATE GOVERNMENT</p>
              <p className="text-[11px] font-semibold uppercase">Ministry of Lands and Housing</p>
              <h1 className="mt-1 text-[18px] font-black uppercase">Property History Search Slip</h1>
              <p className="mt-1 text-[10px] font-bold uppercase underline">Abia State Land Administration and E-Governance System</p>
            </div>
            <img src="/images/abia-state--logo.png" alt="Abia State coat of arms" className="h-16 w-16 object-contain" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-bold"><span>ABIA STATE PHS PORTAL</span><span>Date: {new Date().toLocaleDateString('en-GB')}</span></div>
        </header>

        <section className="mt-4 border border-foreground">
          <div className="border-b border-foreground bg-muted px-3 py-1 text-[11px] font-black uppercase">Search Details</div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 p-3 text-[10px] sm:grid-cols-3">
            <SlipField label="Abia State File No." value={fileNumber} />
            <SlipField label="ABIAGIS No." value={record.propertyId} />
            <SlipField label="Search Status" value={record.status ?? 'Verified'} />
            <SlipField label="File Title / Holder" value={record.grantee ?? record.owner} />
            <SlipField label="Schedule" value={record.scheduleName ?? record.property} />
            <SlipField label="Layout" value={record.layoutName} />
            <SlipField label="Plot No." value={record.plotNumber} />
            <SlipField label="Plot Size" value={record.plotSize} />
            <SlipField label="Land Use" value={record.landUse} />
            <SlipField label="LGA / City" value={record.lga ?? record.location} />
            <SlipField label="District" value={record.district} />
            <SlipField label="Registration No." value={record.registrationNumber ?? record.parentRegistration} />
          </div>
        </section>

        <section className="mt-4 border border-foreground">
          <div className="border-b border-foreground bg-muted px-3 py-1 text-[11px] font-black uppercase">Property Description</div>
          <p className="min-h-12 p-3 text-[10px]">{record.propertyDescription ?? record.address ?? 'Not recorded'}</p>
        </section>

        <section className="mt-4 border border-foreground">
          <div className="border-b border-foreground bg-muted px-3 py-1 text-[11px] font-black uppercase">Search Result</div>
          <div className="grid grid-cols-2 gap-3 p-3 text-[10px] sm:grid-cols-4">
            <SlipField label="Grantor" value={record.grantor ?? 'Abia State Government'} />
            <SlipField label="Grantee" value={record.grantee ?? record.owner} />
            <SlipField label="Instrument" value={record.transactionType} />
            <SlipField label="Caveat" value={caveat} emphasis={caveat === 'YES'} />
          </div>
        </section>

        <div className="mt-6 border-t border-foreground pt-3 text-[9px] leading-relaxed">
          <p className="font-bold uppercase">Important Notice</p>
          <p>This slip is generated from available Abia State property records through the PHS Portal. It is a search result and does not constitute a title document or conveyance.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 text-[10px]
        "><div>Applicant / Institution: ____________________<br /><br />Signature / Date: __________________________</div><div>Verified by: ______________________________<br /><br />Official Stamp: ___________________________</div></div>
        <footer className="mt-5 flex justify-between border-t border-foreground pt-2 text-[9px] text-muted-foreground"><span>Abia State PHS Portal</span><span>Generated for search purposes</span></footer>
      </article>
    </Modal>
  )
}

function formatAbiaFileNumber(value: string) {
  const cleaned = value.trim()
  if (!cleaned || cleaned === '—') return 'ABIA/PHS/NOT-RECORDED'
  if (/^ABIA\//i.test(cleaned)) return cleaned.toUpperCase()
  return `ABIA/PHS/${cleaned.toUpperCase()}`
}

function SlipField({ label, value, emphasis = false }: { label: string; value?: string; emphasis?: boolean }) {
  return <div><span className="font-bold">{label}: </span><strong className={emphasis ? 'text-destructive' : undefined}>{value || 'Not recorded'}</strong></div>
}
