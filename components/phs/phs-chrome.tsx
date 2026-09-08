'use client'

import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PORTAL_ORG } from '@/lib/phs-portal-data'
import { usePortal } from '@/components/phs/phs-store'

/** Public site top navigation shown on landing / marketing views. */
export function PublicHeader() {
  const { setView } = usePortal()
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setView('landing')} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
            <Image src="/images/abiagis-emblem.png" alt="ALAES emblem" width={40} height={40} className="h-full w-full object-contain" />
          </span>
          <span className="text-left">
            <span className="block text-sm font-bold leading-tight text-slate-900">ALAES Portal</span>
            <span className="block text-[11px] leading-tight text-slate-500">Institutional Legal Search</span>
          </span>
        </button>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition-colors hover:text-emerald-700">Features</a>
          <a href="#packages" className="transition-colors hover:text-emerald-700">Packages</a>
          <a href="#contact" className="transition-colors hover:text-emerald-700">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('signin')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setView('register')}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Register
          </button>
        </div>
      </div>
    </header>
  )
}

/** Shared marketing footer. */
export function PublicFooter() {
  return (
    <footer id="contact" className="bg-slate-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">
                <Image src="/images/abiagis-emblem.png" alt="ALAES emblem" width={40} height={40} className="h-full w-full object-contain" />
              </span>
              <span className="text-lg font-bold">ALAES</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Official government platform for legal search services and land record verification in Abia State.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Services</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Legal Search</li>
              <li>Property Verification</li>
              <li>Title Investigation</li>
              <li>Due Diligence Reports</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Help Center</li>
              <li>Contact Support</li>
              <li>API Documentation</li>
              <li>System Status</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Contact Us</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0" />{PORTAL_ORG.email}</div>
              <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0" />{PORTAL_ORG.phone}</div>
              <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{PORTAL_ORG.address}</span></div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>&copy; 2026 Abia State Land Administration &amp; E-Governance System (ALAES). All rights reserved.</p>
          <p className="mt-1">Empowering Abia with transparent and efficient land administration.</p>
        </div>
      </div>
    </footer>
  )
}
