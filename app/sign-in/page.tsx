'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (username === 'admin' && password === 'admin123') {
      setError('')
      setSubmitted(true)
      router.push('/')
      return
    }

    setSubmitted(false)
    setError('Demo sign-in failed. Use username admin and password admin123.')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0%,hsl(var(--primary-foreground)/.18)_45%,transparent_46%,transparent_100%)] [background-size:28px_28px]" />
          <div className="relative flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-primary-foreground text-primary shadow-lg">
              <span className="text-xl font-bold">A</span>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">ALAES</p>
              <p className="text-xs text-primary-foreground/70">Abia Land Administration</p>
            </div>
          </div>
          <div className="relative max-w-xl pb-8">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">Enterprise land services</p>
            <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Manage land records with confidence.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/75">A secure workspace for Abia State land administration, deeds registration, document management, and property records.</p>
          </div>
          <p className="relative text-xs text-primary-foreground/60">Official digital services platform · Abia State</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><span className="font-bold">A</span></div>
              <div><p className="font-semibold">ALAES</p><p className="text-xs text-muted-foreground">Abia Land Administration</p></div>
            </div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">Welcome back</p>
              <h2 className="text-3xl font-semibold tracking-tight">Sign in to ALAES</h2>
              <p className="mt-3 leading-6 text-muted-foreground">Enter your username and password to access your workspace.</p>
              <p className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">Demo access: <span className="font-medium text-foreground">admin</span> / <span className="font-medium text-foreground">admin123</span></p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="username">
                Username
                <span className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input id="username" name="username" autoComplete="username" required placeholder="Enter your username" className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </span>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">
                Password
                <span className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button>
                </span>
              </label>
              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 accent-primary" />Remember me</label>
                <button type="button" className="font-medium text-primary hover:underline">Forgot password?</button>
              </div>
              <Button type="submit" className="h-12 w-full text-sm font-semibold">Sign in <ArrowRight data-icon="inline-end" /></Button>
              {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
              {submitted && <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">Demo sign-in successful. You can now preview the authenticated workspace flow.</p>}
            </form>
            <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">By signing in, you agree to use ALAES in accordance with official access and security policies.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
