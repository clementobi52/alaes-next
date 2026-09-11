'use client'

import { useState } from 'react'
import { Bell, CheckCircle2, FileCheck2, Menu, Settings, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export type Metric = { label: string; value: string; tone: 'plain' | 'primary' }

const DEFAULT_METRICS: Metric[] = [
  { label: 'Interviews', value: '15%', tone: 'plain' },
  { label: 'Hired', value: '60%', tone: 'primary' },
  { label: 'Project time', value: '10%', tone: 'plain' },
]

export function TopBar({
  onMenu,
  title = 'Welcome back, Admin',
  subtitle = "Here's what's happening with your land registry today.",
  metrics = DEFAULT_METRICS,
}: {
  onMenu: () => void
  title?: string
  subtitle?: string
  metrics?: Metric[]
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Toggle navigation"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onMenu}
          aria-label="Collapse navigation"
          className="hidden h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent lg:flex"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {metrics.length > 0 && (
        <div className="hidden items-center gap-4 rounded-xl border border-border bg-card/60 px-4 py-2.5 xl:flex">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <span
                className={
                  m.tone === 'primary'
                    ? 'rounded-md bg-primary px-2 py-0.5 text-sm font-semibold text-primary-foreground'
                    : 'text-sm font-semibold text-foreground'
                }
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
        )}

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <h2 className="font-semibold">Notifications</h2>
                  <p className="text-xs text-muted-foreground">3 updates requiring attention</p>
                </div>
                <button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button>
              </div>
              <div className="divide-y divide-border">
                <button type="button" className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted"><FileCheck2 className="mt-0.5 size-5 shrink-0 text-primary" /><span><span className="block text-sm font-medium">Legal search completed</span><span className="block text-xs text-muted-foreground">LSR/AB/2026/0184 is ready for review.</span><span className="mt-1 block text-[11px] text-muted-foreground">12 minutes ago</span></span></button>
                <button type="button" className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" /><span><span className="block text-sm font-medium">Instrument registration approved</span><span className="block text-xs text-muted-foreground">Deed file AB/REG/2026/0047 was approved.</span><span className="mt-1 block text-[11px] text-muted-foreground">1 hour ago</span></span></button>
                <button type="button" className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted"><Bell className="mt-0.5 size-5 shrink-0 text-amber-600" /><span><span className="block text-sm font-medium">Valuation follow-up due</span><span className="block text-xs text-muted-foreground">2 compensation cases need review today.</span><span className="mt-1 block text-[11px] text-muted-foreground">3 hours ago</span></span></button>
              </div>
              <button type="button" onClick={() => setNotificationsOpen(false)} className="w-full border-t border-border px-4 py-3 text-sm font-semibold text-primary hover:bg-muted">Mark all as read</button>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
