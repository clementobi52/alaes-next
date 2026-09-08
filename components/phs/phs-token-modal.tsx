'use client'

import { useState } from 'react'
import { CreditCard, FileText, X } from 'lucide-react'
import { NAIRA, TOKEN_PACKAGES, type TokenPackage } from '@/lib/phs-portal-data'
import { usePortal } from '@/components/phs/phs-store'

const ACCENT: Record<string, { ring: string; text: string; border: string }> = {
  emerald: { ring: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-600', border: 'border-emerald-500 ring-emerald-500/30' },
  blue: { ring: 'bg-blue-100 text-blue-700', text: 'text-blue-600', border: 'border-blue-500 ring-blue-500/30' },
  violet: { ring: 'bg-violet-100 text-violet-700', text: 'text-violet-600', border: 'border-violet-500 ring-violet-500/30' },
}

export function TokenPurchaseModal({ onClose }: { onClose: () => void }) {
  const { addTokens } = usePortal()
  const [selected, setSelected] = useState<TokenPackage>(TOKEN_PACKAGES[1])
  const [confirmation, setConfirmation] = useState<string | null>(null)

  const purchase = (method: 'online' | 'invoice') => {
    if (method === 'online') {
      addTokens(selected.tokens, `Purchased ${selected.name} package (${selected.tokens.toLocaleString()} tokens)`)
      setConfirmation(`Payment successful. ${selected.tokens.toLocaleString()} tokens added to your balance.`)
    } else {
      addTokens(0, `Invoice requested for ${selected.name} package`)
      setConfirmation('Invoice request submitted. Your tokens will be credited once payment is confirmed.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between rounded-t-xl bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">Purchase Tokens</h2>
            <p className="text-sm text-white/85">Choose a package to top up your balance</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {confirmation ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <p className="text-lg font-semibold text-emerald-800">{confirmation}</p>
              <button type="button" onClick={onClose} className="mt-6 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Done</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {TOKEN_PACKAGES.map((pkg) => {
                  const accent = ACCENT[pkg.accent]
                  const active = selected.id === pkg.id
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelected(pkg)}
                      className={`relative flex flex-col items-center rounded-xl border bg-white p-6 text-center transition-all ${active ? `${accent.border} ring-2` : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white">POPULAR</span>
                      )}
                      <span className={`flex h-16 w-16 items-center justify-center rounded-full ${accent.ring}`}>
                        <pkg.icon className="h-8 w-8" />
                      </span>
                      <h3 className={`mt-3 text-xl font-bold ${accent.text}`}>{pkg.name}</h3>
                      <p className={`mt-1 text-3xl font-extrabold ${accent.text}`}>{NAIRA.format(pkg.price)}</p>
                      <p className="mt-1 text-sm text-slate-500">{pkg.tokens.toLocaleString()} Tokens</p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-col justify-center gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                <button type="button" onClick={() => purchase('online')} className="inline-flex flex-1 max-w-xs items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700">
                  <CreditCard className="h-5 w-5" /> Pay Online
                </button>
                <button type="button" onClick={() => purchase('invoice')} className="inline-flex flex-1 max-w-xs items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                  <FileText className="h-5 w-5" /> Request Invoice
                </button>
              </div>
              <div className="mt-6 text-center">
                <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-6 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
