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
  history?: Array<Partial<Record<'fileNo' | 'transactionType' | 'grantor' | 'grantee' | 'created' | 'particulars' | 'caveat' | 'comment', string>>>
}

export function SearchReport({ record, official, onClose }: { record: SearchRecord; official: boolean; onClose: () => void }) {
  const transactions = record.history?.length ? record.history : [{
    fileNo: record.fileNo,
    transactionType: record.transactionType ?? record.instrument,
    grantor: record.grantor ?? 'Abia State Government',
    grantee: record.grantee ?? record.owner,
    created: record.created,
    particulars: record.particulars,
    caveat: record.caveat,
  }]

  return (
    <Modal open onClose={onClose} title="Search Report Preview" widthClass="max-w-[95vw]" footer={<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Close</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" /> Print report</button></div>}>
      <article className="legal-search-report relative mx-auto min-h-[7.6in] w-[11in] max-w-full overflow-visible bg-card px-[0.4in] py-[0.2in] text-foreground shadow-sm print:min-h-0 print:w-full print:max-w-none print:shadow-none">
        {official && <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"><span className="-rotate-30 select-none whitespace-nowrap text-[clamp(3rem,9vw,8rem)] font-black tracking-[0.16em] text-destructive/10">FOR OFFICIAL PURPOSE</span></div>}
        <div className="relative z-10">
          <header className="report-header border-b-2 border-foreground pb-2"><div className="flex items-center justify-between gap-4"><div className="h-14 w-16 shrink-0 border border-border bg-muted/30" aria-label="Abia State emblem placeholder" /><div className="flex-1 text-center"><p className="text-[15px] font-bold uppercase tracking-wide text-primary">ABIA STATE MINISTRY OF LANDS AND HOUSING</p><h1 className="mt-1 text-[19px] font-bold">LEGAL SEARCH REPORT</h1><p className="mt-1 text-[13px] font-bold underline">{official ? 'Official Search (For Filing Purpose)' : 'On-Premise Pay-per-Search'}</p></div><div className="h-14 w-16 shrink-0 border border-border bg-muted/30" aria-label="Abia State lands logo placeholder" /></div><p className="mt-1 text-right text-[11px] font-bold">Date: {new Date().toLocaleDateString('en-GB')}</p></header>
          <div className="mt-3 inline-block border border-foreground px-2 py-1 text-xs font-bold">Property Details</div>
          <div className="report-property-details mt-1 grid grid-cols-2 gap-x-8 gap-y-2 border-b border-border pb-3 text-[11px] md:grid-cols-4"><ReportField label="Property ID" value={record.propertyId ?? record.id} /><ReportField label="File Number" value={record.fileNo} /><ReportField label="Current Holder" value={record.grantee ?? record.owner} /><ReportField label="LGA / City" value={record.lga ?? 'Abia State'} /><ReportField label="Schedule" value={record.scheduleName ?? record.property} /><ReportField label="Layout" value={record.layoutName ?? record.location} /><ReportField label="Plot Number" value={record.plotNumber ?? 'Not recorded'} /><ReportField label="Plot Size" value={record.plotSize ?? 'Not recorded'} /><ReportField label="Approval" value={record.approved ?? record.status} /><ReportField label="Parent Registration" value={record.particulars ?? 'Not recorded'} /></div>
          <div className="mt-3 inline-block border border-foreground px-2 py-1 text-xs font-bold">File History</div>
          <div className="mt-1 overflow-x-auto"><table className="report-transaction-table w-full min-w-[850px] table-fixed border-collapse text-[10px]"><thead><tr className="border-b-2 border-foreground text-left"><th className="w-[3%] py-1">S/N</th><th className="w-[11%] py-1">File No.</th><th className="w-[15%] py-1">Instrument / Transaction Type</th><th className="w-[12%] py-1">Party 1</th><th className="w-[12%] py-1">Party 2</th><th className="w-[11%] py-1">Transaction Date</th><th className="w-[17%] py-1">Particulars</th><th className="w-[8%] py-1">Caveat</th><th className="w-[11%] py-1">Comments</th></tr></thead><tbody>{transactions.map((transaction, index) => <tr key={`${transaction.fileNo ?? record.fileNo}-${index}`} className="border-b border-border align-top"><td className="py-2">{index + 1}</td><td className="py-2 font-mono">{transaction.fileNo ?? record.fileNo}</td><td className="py-2">{transaction.transactionType ?? 'Property transaction'}</td><td className="py-2">{transaction.grantor ?? 'Abia State Government'}</td><td className="py-2">{transaction.grantee ?? record.owner ?? 'Not recorded'}</td><td className="py-2">{transaction.created ?? 'Not recorded'}</td><td className="py-2">{transaction.particulars ?? 'Transaction history record'}</td><td className="py-2">{transaction.caveat ?? 'None'}</td><td className="py-2">{transaction.comment ?? 'Available record'}</td></tr>)}</tbody></table></div>
          <div className="mt-5 border-t border-foreground pt-3"><span className="border border-foreground px-2 py-1 text-xs font-bold">Remarks</span><p className="mt-3 text-xs font-semibold text-primary">This search report is prepared from the available Abia State property and transaction records.</p><p className="mt-4 text-center text-[10px] font-bold italic">N.B: This search report is deduced based on the available records from the file and does not represent any document in possession of any body.</p></div>
          <div className="mt-8 grid grid-cols-3 gap-6 text-[10px]"><div>Name: ____________________<br /><br />Rank: ____________________<br /><br />Sign / Date: _______________</div><div>Verified by: _______________<br /><br />Rank: ____________________<br /><br />Sign / Date: _______________</div><div>Sign / Date: _______________<br /><br /><strong>Director Deeds</strong><br /><span>(for Permanent Secretary / Commissioner)</span></div></div>
          <div className="mt-6 flex justify-between border-t border-foreground pt-2 text-[9px] text-muted-foreground"><span>Abia State Land Administration and E-Governance System</span><span>{official ? 'Generated for official filing purpose' : 'Generated via on-premise pay-per-search'}</span></div>
        </div>
      </article>
    </Modal>
  )
}

function ReportField({ label, value }: { label: string; value?: string | number }) { return <div><span className="font-bold">{label}: </span><strong>{value || 'Not recorded'}</strong></div> }
