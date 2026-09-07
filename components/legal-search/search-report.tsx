'use client'

import { Printer } from 'lucide-react'
import { Modal } from '@/components/system-admin/primitives'

type SearchRecord = {
  id: string | number
  fileNo: string
  property?: string
  owner?: string
  lga?: string
  location?: string
  status?: string
  instrument?: string
  propertyId?: string
  grantor?: string
  grantee?: string
  scheduleName?: string
  layoutName?: string
  plotNumber?: string
  plotSize?: string
  approved?: string
  particulars?: string
  transactionType?: string
  created?: string
  caveat?: string
}

export function SearchReport({ record, official, onClose }: { record: SearchRecord; official: boolean; onClose: () => void }) {
  const transaction = {
    type: record.transactionType ?? record.instrument ?? 'Property transaction',
    party1: record.grantor ?? 'Abia State Government',
    party2: record.grantee ?? record.owner ?? 'Not recorded',
    date: record.created ?? 'Not recorded',
    particulars: record.particulars ?? 'Transaction history record',
    caveat: record.caveat ?? 'None',
  }

  return (
    <Modal open onClose={onClose} title="Search Report Preview" widthClass="max-w-[95vw]" footer={<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Close</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" /> Print report</button></div>}>
      <article className="relative mx-auto min-h-[760px] max-w-[1120px] overflow-hidden bg-card px-8 py-6 text-foreground shadow-sm print:min-h-screen print:shadow-none">
        {official && <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"><span className="-rotate-30 select-none whitespace-nowrap text-[clamp(3rem,9vw,8rem)] font-black tracking-[0.16em] text-destructive/10">FOR OFFICIAL PURPOSE</span></div>}
        <div className="relative z-10">
          <header className="border-b-2 border-foreground pb-2"><div className="text-center"><p className="text-sm font-bold uppercase tracking-wide text-primary">Abia State Ministry of Lands and Housing</p><h1 className="mt-1 text-xl font-bold">LEGAL SEARCH REPORT</h1><p className="mt-1 text-sm font-bold underline">{official ? 'Official Search (For Filing Purpose)' : 'On-Premise Pay-per-Search'}</p></div><p className="mt-2 text-right text-xs font-semibold">Date: {new Date().toLocaleDateString('en-GB')}</p></header>
          <div className="mt-3 inline-block border border-foreground px-2 py-1 text-xs font-bold">Property Details</div>
          <div className="mt-1 grid grid-cols-2 gap-x-8 gap-y-2 border-b border-border pb-3 text-xs md:grid-cols-4"><ReportField label="Property ID" value={record.propertyId ?? record.id} /><ReportField label="File Number" value={record.fileNo} /><ReportField label="Current Holder" value={record.grantee ?? record.owner} /><ReportField label="LGA / City" value={record.lga ?? 'Abia State'} /><ReportField label="Schedule" value={record.scheduleName ?? record.property} /><ReportField label="Layout" value={record.layoutName ?? record.location} /><ReportField label="Plot Number" value={record.plotNumber ?? 'Not recorded'} /><ReportField label="Plot Size" value={record.plotSize ?? 'Not recorded'} /><ReportField label="Approval" value={record.approved ?? record.status} /><ReportField label="Parent Registration" value={record.particulars ?? 'Not recorded'} /></div>
          <div className="mt-3 inline-block border border-foreground px-2 py-1 text-xs font-bold">File History</div>
          <div className="mt-1 overflow-x-auto"><table className="w-full min-w-[850px] table-fixed border-collapse text-[10px]"><thead><tr className="border-b-2 border-foreground text-left"><th className="w-8 py-1">S/N</th><th className="w-[15%] py-1">File No.</th><th className="w-[17%] py-1">Instrument / Transaction Type</th><th className="w-[18%] py-1">Party 1</th><th className="w-[18%] py-1">Party 2</th><th className="w-[12%] py-1">Transaction Date</th><th className="w-[15%] py-1">Particulars</th><th className="w-[8%] py-1">Caveat</th></tr></thead><tbody><tr className="border-b border-border align-top"><td className="py-2">1</td><td className="py-2 font-mono">{record.fileNo}</td><td className="py-2">{transaction.type}</td><td className="py-2">{transaction.party1}</td><td className="py-2">{transaction.party2}</td><td className="py-2">{transaction.date}</td><td className="py-2">{transaction.particulars}</td><td className="py-2">{transaction.caveat}</td></tr></tbody></table></div>
          <div className="mt-5 border-t border-foreground pt-3"><span className="border border-foreground px-2 py-1 text-xs font-bold">Remarks</span><p className="mt-3 text-xs font-semibold text-primary">This search report is prepared from the available Abia State property and transaction records.</p><p className="mt-4 text-center text-[10px] font-bold italic">N.B: This search report is deduced based on the available records from the file and does not represent any document in possession of any body.</p></div>
          <div className="mt-8 grid grid-cols-3 gap-6 text-[10px]"><div>Name: ____________________<br /><br />Rank: ____________________<br /><br />Sign / Date: _______________</div><div>Verified by: _______________<br /><br />Rank: ____________________<br /><br />Sign / Date: _______________</div><div>Sign / Date: _______________<br /><br /><strong>Director Deeds</strong><br /><span>(for Permanent Secretary / Commissioner)</span></div></div>
          <div className="mt-6 flex justify-between border-t border-foreground pt-2 text-[9px] text-muted-foreground"><span>Abia State Land Administration and E-Governance System</span><span>{official ? 'Generated for official filing purpose' : 'Generated via on-premise pay-per-search'}</span></div>
        </div>
      </article>
    </Modal>
  )
}

function ReportField({ label, value }: { label: string; value?: string | number }) { return <div><span className="font-bold">{label}: </span><strong>{value || 'Not recorded'}</strong></div> }
