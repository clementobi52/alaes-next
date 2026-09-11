'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    setLoading(true); setError(''); setSubmitted(false)
    try {
      const response = await fetch('/api/auth/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      const result = await response.json()
      if (!response.ok) { setError(result.error ?? 'Unable to sign in.'); return }
      setSubmitted(true); router.push('/'); router.refresh()
    } catch { setError('Unable to connect to the sign-in service.') } finally { setLoading(false) }
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
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="username">Username<span className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input id="username" name="username" autoComplete="username" required placeholder="Enter your username" className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></span></label>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password"><span className="flex items-center justify-between">Password<button type="button" className="text-xs font-medium text-primary hover:underline">Forgot password?</button></span><span className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 accent-primary" />Remember me</label>
              <Button type="submit" disabled={loading} className="h-11 w-full font-semibold">{loading ? 'Signing in…' : 'Sign in'} {!loading && <ArrowRight data-icon="inline-end" />}</Button>
              {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
              {submitted && <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">Demo sign-in successful.</p>}
            </form>
            <p className="mt-7 text-center text-sm text-muted-foreground">Don&apos;t have an account? <button type="button" className="font-medium text-primary hover:underline">Contact administrator</button></p>
          </div>
        </section>
        <section className="hidden min-h-screen overflow-y-auto bg-background px-8 py-12 lg:block xl:px-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex justify-center"><div className="grid size-24 place-items-center rounded-2xl border border-primary/15 bg-primary/10 text-5xl font-bold text-primary">A</div></div>
            <div className="mb-8 text-center"><h2 className="text-4xl font-bold tracking-tight">ALAES</h2><h3 className="mt-2 text-2xl font-semibold">Abia Land Administration Enterprise System</h3><p className="mt-4 text-base font-medium italic text-primary">Secure, transparent and integrated land governance for Abia State.</p></div>
            <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm"><p className="leading-7 text-muted-foreground">ALAES is the digital backbone for Abia State land administration, bringing land records, deeds registration, legal search, document management and property services into one connected workspace.</p></div>
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-6"><h3 className="mb-3 text-xl font-semibold">One connected land governance platform</h3><p className="leading-7 text-muted-foreground">From first application to final registration, teams work from synchronized records with clear approvals, auditable activity and secure access.</p></div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><h3 className="mb-5 text-xl font-semibold">Key capabilities</h3><div className="grid gap-5 sm:grid-cols-2"><div className="flex gap-3"><CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Digital legal search</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Search ownership history, encumbrances and property records.</p></div></div><div className="flex gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Secure records</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Protect sensitive land information with controlled access.</p></div></div><div className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Connected workflows</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Route applications between departments with visibility.</p></div></div><div className="flex gap-3"><CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" /><div><h4 className="font-medium">Transparent service</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">Improve accountability and service delivery across the state.</p></div></div></div></div>
            <p className="mt-8 text-center text-xs text-muted-foreground">Official digital services platform · Abia State</p>
          </div>
        </section>
      </div>
    </main>
  )
}
