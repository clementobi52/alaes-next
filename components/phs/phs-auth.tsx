'use client'

import { useState } from 'react'
import { ArrowLeft, Building2, Info, Lock, Users } from 'lucide-react'
import { INSTITUTION_LABELS, type InstitutionType } from '@/lib/phs-portal-data'
import { usePortal } from '@/components/phs/phs-store'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'

export function PhsSignIn() {
  const { signIn, setView } = usePortal()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = signIn(username, password)
    if (!result.ok) setError(result.error ?? 'Unable to sign in.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Building2 className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your institution portal</p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Demo Accounts</p>
                <p className="mt-1 text-xs">Bank: Abia Trust Bank / demo123</p>
                <p className="text-xs">Law Firm: Okoro &amp; Partners Legal / demo123</p>
              </div>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="signin-username" className="mb-1 block text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="signin-username" value={username} onChange={(e) => { setUsername(e.target.value); setError('') }} required placeholder="Enter your username" autoComplete="username" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label htmlFor="signin-password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="signin-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} required placeholder="Enter your password" autoComplete="current-password" className={`${inputClass} pl-10`} />
              </div>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">Sign In</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => setView('register')} className="font-medium text-emerald-600 hover:text-emerald-500">Register here</button>
          </p>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <button type="button" onClick={() => setView('landing')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhsRegister() {
  const { register, setView } = usePortal()
  const [type, setType] = useState<InstitutionType>('bank')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match.')
    if (!agree) return setError('Please accept the Terms of Service to continue.')
    const result = register({ name, type, email, phone, password })
    if (!result.ok) setError(result.error ?? 'Unable to register.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Users className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Register Your Institution</h2>
          <p className="mt-1 text-sm text-slate-500">Onboard your team in minutes — 100 free tokens included</p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="reg-type" className="mb-1 block text-sm font-medium text-slate-700">Institution Type</label>
              <select id="reg-type" value={type} onChange={(e) => setType(e.target.value as InstitutionType)} className={inputClass}>
                {(Object.keys(INSTITUTION_LABELS) as InstitutionType[]).map((key) => (
                  <option key={key} value={key}>{INSTITUTION_LABELS[key]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-slate-700">Institution Name *</label>
              <input id="reg-name" value={name} onChange={(e) => { setName(e.target.value); setError('') }} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-slate-700">Email Address *</label>
              <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="reg-phone" className="mb-1 block text-sm font-medium text-slate-700">Phone Number *</label>
              <input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-slate-700">Password *</label>
                <input id="reg-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="reg-confirm" className="mb-1 block text-sm font-medium text-slate-700">Confirm *</label>
                <input id="reg-confirm" type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError('') }} required className={inputClass} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              I agree to the Terms of Service and Privacy Policy
            </label>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">Register Institution</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button type="button" onClick={() => setView('signin')} className="font-medium text-emerald-600 hover:text-emerald-500">Sign In</button>
          </p>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <button type="button" onClick={() => setView('landing')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
