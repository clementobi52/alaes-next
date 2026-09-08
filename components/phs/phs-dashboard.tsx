'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Building2,
  FileSearch,
  FileText,
  LogOut,
  Search,
  Settings,
  ShoppingCart,
} from 'lucide-react'
import { usePortal } from '@/components/phs/phs-store'
import { TokenPurchaseModal } from '@/components/phs/phs-token-modal'
import { PhsSearchSlip } from '@/components/phs/phs-search-slip'

type ApiRecord = Record<string, string | undefined> & { id?: string; propertyId?: string; fileNo?: string; history?: Array<Record<string, string | undefined>> }

type DashboardRecord = {
  id: string
  fileNo: string
  property: string
  owner: string
  location: string
  landUse: string
  status: string
  propertyId?: string
  scheduleName?: string
  layoutName?: string
  plotNumber?: string
  grantee?: string
  grantor?: string
  lga?: string
  transactionType?: string
  caveat?: string
  created?: string
  propertyDescription?: string
  address?: string
  planNumber?: string
  plotSize?: string
  district?: string
  registrationNumber?: string
  parentRegistration?: string
  approved?: string
  history?: Array<Record<string, string | undefined>>
}

function mapRecord(record: ApiRecord): DashboardRecord {
  return {
    ...record,
    id: String(record.id ?? record.propertyId ?? record.fileNo ?? Math.random()),
    fileNo: record.fileNo || '—',
    property: record.scheduleName || record.propertyDescription || 'Property record',
    owner: record.grantee || record.owner || 'Not recorded',
    location: record.scheduleName || record.layoutName || 'Abia State',
    landUse: record.landUse ?? '—',
    status: record.approved === 'Yes' ? 'Verified' : 'Pending',
    created: record.created ?? '—',
    propertyDescription: record.propertyDescription,
    address: record.address,
    planNumber: record.planNumber,
    plotSize: record.plotSize,
    district: record.district,
    registrationNumber: record.registrationNumber,
    parentRegistration: record.parentRegistration,
    approved: record.approved,
    history: Array.isArray(record.history) ? record.history : undefined,
  }
}

export function PhsDashboard() {
  const { currentOrg, logout, consumeToken, setView, logActivity } = usePortal()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [records, setRecords] = useState<DashboardRecord[]>([])
  const [error, setError] = useState('')
  const [tokenModal, setTokenModal] = useState(false)
  const [reportRecord, setReportRecord] = useState<DashboardRecord | null>(null)

  if (!currentOrg) return null
  const { settings, tokens } = currentOrg
  const initial = settings.name.charAt(0).toUpperCase()

  const runSearch = async () => {
    if (!query.trim()) {
      setError('Enter a file number, owner, plot, or ABIAGIS number to search.')
      return
    }
    if (tokens < 1) {
      setError('You are out of tokens. Purchase a package to continue searching.')
      setTokenModal(true)
      return
    }
    if (!consumeToken()) {
      setError('You are out of tokens. Purchase a package to continue searching.')
      return
    }
    setError('')
    setLoading(true)
    setSearched(true)
    logActivity({ action: `Legal search: "${query.trim()}"`, user: settings.name, type: 'search' })
    try {
      const response = await fetch(`/api/legal-search/records?search=${encodeURIComponent(query.trim())}`)
      const payload = await response.json()
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? 'Search failed.')
      setRecords((payload.records ?? []).map(mapRecord))
    } catch {
      setError('Unable to load Abia State property records. Please try again.')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}>
              {settings.logoUrl ? (
                <Image src={settings.logoUrl || '/placeholder.svg'} alt="Organization logo" width={40} height={40} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-white" />
              )}
            </span>
            <div>
              <h1 className="text-lg font-bold">{settings.name}</h1>
              <p className="text-xs text-slate-500">Institutional Legal Search Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">Available Tokens</p>
              <p className="text-xl font-bold" style={{ color: settings.primaryColor }}>{tokens.toLocaleString()}</p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}>{initial}</span>
            <button type="button" onClick={() => setView('organization')} className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700">
              <Settings className="h-4 w-4" /> <span className="hidden lg:inline">Manage Organization</span>
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex h-40 max-w-7xl items-center justify-center overflow-hidden text-center sm:h-56" style={{ background: settings.bannerUrl ? `url(${settings.bannerUrl}) center/cover` : `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}>
        <div className="px-4">
          <p className="text-2xl font-bold text-white">Welcome to {settings.name}</p>
          <p className="mt-1 text-sm text-white/80">Secure, fast, and reliable property records</p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-xl p-6 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-sm text-white/80">Available Token Balance</p>
              <p className="mt-1 text-5xl font-bold">{tokens.toLocaleString()}</p>
              <p className="mt-2 text-xs text-white/80">Each search consumes 1 token</p>
            </div>
            <button type="button" onClick={() => setTokenModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow transition-transform hover:-translate-y-0.5">
              <ShoppingCart className="h-5 w-5" /> Purchase Tokens
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-xl font-semibold">Legal Document Search</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) runSearch() }}
                placeholder="File number, ABIAGIS No., Owner, Plot No..."
                className="h-12 w-full rounded-lg border border-slate-300 pl-11 pr-4 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <button type="button" onClick={runSearch} disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-base font-medium text-white transition-colors disabled:opacity-60" style={{ backgroundColor: settings.primaryColor }}>
              <Search className="h-5 w-5" /> {loading ? 'Searching…' : 'Search (1 Token)'}
            </button>
          </div>
          <p className="mt-2.5 text-xs text-slate-500">Examples: &quot;COM-RES-2021-078&quot;, &quot;ABGIS12345&quot;, &quot;John Doe&quot;</p>
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          </div>
        ) : searched ? (
          <section className="pb-12">
            <h2 className="mb-6 text-2xl font-semibold">
              Search Results <span className="font-normal text-slate-500">({records.length} found)</span>
            </h2>
            {records.length === 0 ? (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <FileSearch className="mx-auto mb-6 h-16 w-16 text-slate-300" />
                <h3 className="mb-3 text-2xl font-semibold text-slate-700">No Results Found</h3>
                <p className="text-slate-500">Try a different file number, owner name, or plot number.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {records.map((record) => (
                  <article key={record.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-semibold text-emerald-700">{record.fileNo}</p>
                        <h3 className="mt-1 font-semibold">{record.property}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${record.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{record.status}</span>
                    </div>
                    <dl className="mt-4 space-y-1.5 text-sm">
                      <div className="flex justify-between"><dt className="text-slate-500">Owner / Grantee</dt><dd className="font-medium">{record.owner}</dd></div>
                      <div className="flex justify-between"><dt className="text-slate-500">Location</dt><dd className="font-medium">{record.location}</dd></div>
                      <div className="flex justify-between"><dt className="text-slate-500">Land Use</dt><dd className="font-medium">{record.landUse}</dd></div>
                    </dl>
                    <button type="button" onClick={() => setReportRecord(record)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                      <FileText className="h-4 w-4" /> View Search Slip
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FileSearch className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">Run a search to view Abia State land records and generate an official search slip.</p>
          </section>
        )}
      </main>

      {tokenModal && <TokenPurchaseModal onClose={() => setTokenModal(false)} />}
      {reportRecord && <PhsSearchSlip record={reportRecord} onClose={() => setReportRecord(null)} />}
    </div>
  )
}
