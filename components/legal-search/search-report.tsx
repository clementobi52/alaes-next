'use client'

import { useEffect, useState } from 'react'
import { Printer } from 'lucide-react'
import { Modal } from '@/components/system-admin/primitives'

type PropertyTransaction = Partial<
  Record<
    | 'id' | 'fileNo' | 'transactionType' | 'grantor' | 'grantee' | 'guarantor' | 'created'
    | 'registrationDate' | 'instrumentDate' | 'registrationNumber' | 'parentRegistration'
    | 'plotNumber' | 'plotSize' | 'caveat' | 'propertyDescription' | 'address',
    string
  >
>

type SearchRecord = {
  id: string | number
  fileNo: string
  property?: string
  owner?: string
  lga?: string
  district?: string
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
  registrationNumber?: string
  rootRegistration?: string
  parentRegistration?: string
  planNumber?: string
  propertyDescription?: string
  landUse?: string
  address?: string
  created?: string
  caveat?: string
  guarantor?: string
  history?: PropertyTransaction[]
}

function firstValue(transactions: PropertyTransaction[], key: keyof PropertyTransaction) {
  return transactions.map((transaction) => transaction[key]).find((value) => value && String(value).trim())
}

export function SearchReport({ record, official, onClose }: { record: SearchRecord; official: boolean; onClose: () => void }) {
  const [transactions, setTransactions] = useState<PropertyTransaction[]>(record.history?.length ? record.history : [])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Merge EVERY transaction tied to this property id, not just the rows that
  // matched the search. This gives the report the property's full file history.
  useEffect(() => {
    if (!record.propertyId) return
    const controller = new AbortController()
    setLoadingHistory(true)
    fetch(`/api/legal-search/records?propertyId=${encodeURIComponent(record.propertyId)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        const full = payload?.records?.[0]?.history as PropertyTransaction[] | undefined
        if (full?.length) setTransactions(full)
      })
      .catch((reason) => { if (reason.name !== 'AbortError') console.log('[v0] Report history fetch failed', reason) })
      .finally(() => setLoadingHistory(false))
    return () => controller.abort()
  }, [record.propertyId])

  const rows: PropertyTransaction[] = transactions.length ? transactions : [{
    fileNo: record.fileNo,
    transactionType: record.transactionType ?? record.instrument,
    grantor: record.grantor ?? 'Abia State Government',
    grantee: record.grantee ?? record.owner,
    guarantor: record.guarantor,
    created: record.created,
    registrationNumber: record.registrationNumber ?? record.parentRegistration,
    caveat: record.caveat,
    propertyDescription: record.propertyDescription ?? record.address,
  }]

  // Property-level fields fall back to the first transaction that has a value.
  const holder = record.grantee ?? firstValue(rows, 'grantee') ?? record.owner
  const grantor = record.grantor ?? firstValue(rows, 'grantor')

  return (
    <Modal open onClose={onClose} title="Search Report Preview" widthClass="max-w-[95vw]" printable footer={<div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Close</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" /> Print report</button></div>}>
      <article className="legal-search-report relative mx-auto w-[11in] max-w-full overflow-visible bg-card px-[0.4in] py-[0.2in] text-foreground shadow-sm print:min-h-0 print:w-full print:max-w-none print:shadow-none">
        {official && <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"><span className="-rotate-30 select-none whitespace-nowrap text-[clamp(3rem,9vw,8rem)] font-black tracking-[0.16em] text-destructive/10">FOR OFFICIAL PURPOSE</span></div>}
        <div className="relative z-10">
          <header className="report-header border-b-2 border-foreground pb-2"><div className="flex items-center justify-between gap-4">
            <div className="h-14 w-16 shrink-0 flex items-center justify-center overflow-hidden rounded-full">
              <img 
                src="/images/abiagis-emblem.png" 
                alt="Abia State Emblem" 
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-[8px] text-muted-foreground text-center p-1">Emblem</span>')
                }}
              />
            </div>
            <div className="flex-1 text-center"><p className="text-[15px] font-bold uppercase tracking-wide text-primary">ABIA STATE MINISTRY OF LANDS AND HOUSING</p><h1 className="mt-1 text-[19px] font-bold">LEGAL SEARCH REPORT</h1><p className="mt-1 text-[13px] font-bold underline">{official ? 'Official Search (For Filing Purpose)' : 'On-Premise Pay-per-Search'}</p></div>
            <div className="h-14 w-16 shrink-0 flex items-center justify-center overflow-hidden rounded-full">
              <img 
                src="/images/abia-state--logo.png" 
                alt="Abia State Lands Logo" 
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) parent.innerHTML = '<span class="text-[8px] text-muted-foreground text-center p-1">Logo</span>'
                }}
              />
            </div>
          </div><p className="mt-1 text-right text-[11px] font-bold">Date: {new Date().toLocaleDateString('en-GB')}</p></header>
          <div className="mt-2 inline-block border border-foreground px-2 py-0.5 text-xs font-bold">Property Details</div>
          <div className="report-property-details mt-1 grid grid-cols-2 gap-x-8 gap-y-1 border-b border-border pb-2 text-[11px] md:grid-cols-4"><ReportField label="File Number" value={record.fileNo} /><ReportField label="File Number ID" value={record.propertyId ?? record.id} /><ReportField label="File Title (Current Holder)" value={holder} /><ReportField label="Schedule" value={record.scheduleName} /><ReportField label="Layout" value={record.layoutName} /><ReportField label="Plot No." value={record.plotNumber} /><ReportField label="Plot Size" value={record.plotSize} /><ReportField label="Land Use" value={record.landUse} /><ReportField label="LGA / City" value={record.lga} /><ReportField label="District" value={record.district} /><ReportField label="Registration No." value={record.registrationNumber ?? record.parentRegistration} /><ReportField label="Plan No." value={record.planNumber} /><ReportField label="Approval" value={record.approved ?? record.status} /><ReportField label="Plot Description" value={record.propertyDescription ?? record.address} /></div>
          <div className="mt-2 flex items-center gap-2"><span className="inline-block border border-foreground px-2 py-0.5 text-xs font-bold">File History</span><span className="text-[10px] text-muted-foreground">{loadingHistory ? 'Loading full history…' : `${rows.length} transaction${rows.length === 1 ? '' : 's'} on this property`}</span></div>
          <div className="mt-1 overflow-x-auto"><table className="report-transaction-table w-full min-w-[820px] table-fixed border-collapse text-[10px]"><thead><tr className="border-b-2 border-foreground text-left"><th className="w-[4%] py-1">S/N</th><th className="w-[14%] py-1">File No.</th><th className="w-[16%] py-1">Instrument / Transaction Type</th><th className="w-[16%] py-1">Party 1 (Grantor)</th><th className="w-[16%] py-1">Party 2 (Grantee)</th><th className="w-[10%] py-1">Transaction Date</th><th className="w-[12%] py-1">Reg. No. / Particulars</th><th className="w-[8%] py-1 text-center">Caveat</th></tr></thead><tbody>{rows.map((transaction, index) => { const hasCaveat = Boolean(transaction.caveat && !['no', 'none', 'nil', '—'].includes(String(transaction.caveat).trim().toLowerCase())); return <tr key={`${transaction.id ?? transaction.fileNo ?? record.fileNo}-${index}`} className="border-b border-border align-top"><td className="py-1">{index + 1}</td><td className="py-1 font-mono">{transaction.fileNo || record.fileNo || '—'}</td><td className="py-1">{transaction.transactionType || 'Property transaction'}</td><td className="py-1">{transaction.grantor || grantor || 'Abia State Government'}</td><td className="py-1">{transaction.grantee || record.owner || 'Not recorded'}</td><td className="py-1">{formatDate(transaction.instrumentDate || transaction.created)}</td><td className="py-1">{transaction.registrationNumber || transaction.parentRegistration || 'Not recorded'}</td><td className={`py-1 text-center font-semibold ${hasCaveat ? 'text-destructive' : ''}`}>{hasCaveat ? 'Yes' : 'No'}</td></tr> })}</tbody></table><p className="mt-2 text-center text-[10px] font-bold tracking-wide">{loadingHistory ? '' : '*** END OF TRANSACTION HISTORY ***'}</p></div>
          <div className="mt-3 border-t border-foreground pt-2"><span className="border border-foreground px-2 py-0.5 text-xs font-bold">Remarks</span><p className="mt-2 text-xs font-semibold text-primary">This search report is prepared from the available Abia State property and transaction records.</p><p className="mt-2 text-center text-[10px] font-bold italic">N.B: This search report is deduced based on the available records from the file and does not represent any document in possession of any body.</p></div>
          <div className="mt-5 grid grid-cols-3 gap-6 text-[10px]"><div>Name: ____________________<br /><br />Rank: ____________________<br /><br />Sign / Date: _______________</div><div>Verified by: _______________<br /><br />Rank: ____________________<br /><br />Sign / Date: _______________</div><div>Sign / Date: _______________<br /><br /><strong>Director Deeds</strong><br /><span>(for Permanent Secretary / Commissioner)</span></div></div>
          <div className="mt-4 flex justify-between border-t border-foreground pt-2 text-[9px] text-muted-foreground"><span>Abia State Land Administration and E-Governance System</span><span>{official ? 'Generated for official filing purpose' : 'Generated via on-premise pay-per-search'}</span></div>
        </div>
      </article>
    </Modal>
  )
}

function formatDate(value?: string) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB')
}

function ReportField({ label, value }: { label: string; value?: string | number }) { return <div><span className="font-bold">{label}: </span><strong>{value || 'Not recorded'}</strong></div> }