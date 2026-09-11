'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const [remember, setRemember] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const demoCode = '482913'

  function handleRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!phone.trim()) { setError('Enter a phone number to receive your demo sign-in code.'); return }
    setLoading(true); setError(''); setSubmitted(false)
    window.setTimeout(() => { setLoading(false); setStep('code') }, 500)
  }

  function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (code !== demoCode) { setError('That code is not correct. Use the demo code shown below.'); return }
    setSubmitted(true)
    setStep('code')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-muted/30 text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-xl sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-5 grid size-24 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><span className="text-4xl font-bold">A</span></div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome to ALAES</h1>
              <p className="mt-1 text-sm text-muted-foreground">Abia Land Administration Enterprise System</p>
            </div>
            {step === 'phone' ? <form className="flex flex-col gap-5" onSubmit={handleRequestCode}>
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-foreground">Enter your Nigerian phone number and we&apos;ll simulate sending a one-time sign-in code by SMS.</div>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="phone">Phone number<span className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input id="phone" type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0801 234 5678" className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></span></label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 accent-primary" />Remember this device</label>
              <Button type="submit" disabled={loading} className="h-11 w-full font-semibold">{loading ? 'Sending demo code…' : 'Get sign-in code'} {!loading && <ArrowRight data-icon="inline-end" />}</Button>
            </form> : <form className="flex flex-col gap-5" onSubmit={handleVerifyCode}>
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-foreground">A demo code was sent to <strong className="text-foreground">{phone}</strong>. No real SMS is sent.</div>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="code">Sign-in code<input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-center text-lg tracking-[0.35em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-center text-sm">Demo code: <strong className="font-mono text-primary">{demoCode}</strong></div>
              <Button type="submit" className="h-11 w-full font-semibold">Verify and continue <ArrowRight data-icon="inline-end" /></Button>
              <button type="button" onClick={() => { setStep('phone'); setCode(''); setError('') }} className="text-sm font-medium text-primary hover:underline">Use a different number</button>
            </form>}
            {error && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
            {submitted && <p role="status" className="mt-5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">Demo sign-in successful.</p>}
            <p className="mt-7 text-center text-sm text-muted-foreground">Don&apos;t have an account? <button type="button" className="font-medium text-primary hover:underline">Contact administrator</button></p>
          </div>
        </section>
        <section className="hidden min-h-screen overflow-hidden bg-muted/50 px-8 py-8 lg:block xl:px-12" aria-label="ALAES platform information">
          <div className="sign-in-info-scroll mx-auto max-w-3xl">
            <div className="mb-6 flex justify-center"><div className="grid size-28 place-items-center rounded-xl border border-border bg-card text-6xl font-bold text-primary shadow-sm">A</div></div>
            <div className="mb-8 text-center"><h2 className="text-4xl font-bold tracking-tight text-foreground">ALAES</h2><h3 className="mt-2 text-2xl font-semibold text-foreground">Abia Land Administration Enterprise System</h3><p className="mt-3 text-lg font-medium italic text-primary">Powering a smart, secure &amp; integrated future for land governance in Abia State.</p></div>
            <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm"><p className="leading-7 text-muted-foreground">ALAES is the digital backbone for Abia State land administration, bringing land records, deeds registration, legal search, document management and property services into one connected workspace.</p></div>
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm"><h3 className="mb-3 text-center text-xl font-semibold">ALAES – Interoperable, Intelligent, and Future-Proof</h3><p className="leading-7 text-muted-foreground">By bringing together digital records, automated workflows and secure departmental collaboration, ALAES creates a statewide land governance ecosystem for smarter decisions and better service delivery.</p><p className="mt-3 leading-7 text-muted-foreground">Whether teams are registering titles, performing legal searches, managing encumbrances or resolving land disputes, every department works from synchronized data and auditable processes.</p></div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm"><h3 className="mb-5 text-xl font-semibold">Key Features of ALAES</h3><div className="grid gap-5 sm:grid-cols-2"><div className="flex gap-3"><CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Digital legal search</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Search ownership history, encumbrances and property records.</p></div></div><div className="flex gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Secure records</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Protect sensitive land information with controlled access.</p></div></div><div className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Connected workflows</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Route applications between departments with visibility.</p></div></div><div className="flex gap-3"><CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Transparent service</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Improve accountability and service delivery across the state.</p></div></div><div className="flex gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Automated billing and revenue</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Track payments, receipts and approvals through connected revenue workflows.</p></div></div><div className="flex gap-3"><CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Resettlement and compensation</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Coordinate valuation, monetary compensation and land-for-land allocations.</p></div></div></div></div>
            <p className="mt-8 text-center text-xs text-muted-foreground">Official digital services platform · Abia State</p>
          </div>
        </section>
      </div>
    </main>
  )
}
