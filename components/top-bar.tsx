'use client'

import { Bell, Menu, Settings } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const METRICS = [
  { label: 'Interviews', value: '15%', tone: 'plain' as const },
  { label: 'Hired', value: '60%', tone: 'primary' as const },
  { label: 'Project time', value: '10%', tone: 'plain' as const },
]

export function TopBar({ onMenu }: { onMenu: () => void }) {
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
            Welcome back, Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your land registry today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="hidden items-center gap-4 rounded-xl border border-border bg-card/60 px-4 py-2.5 xl:flex">
          {METRICS.map((m) => (
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

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
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
