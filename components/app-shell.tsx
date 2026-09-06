'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar, type Metric } from '@/components/top-bar'
import { cn } from '@/lib/utils'

export function AppShell({
  children,
  title,
  subtitle,
  metrics,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
  metrics?: Metric[]
}) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />

      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <div className={cn('lg:pl-72')}>
        <TopBar
          onMenu={() => setNavOpen((v) => !v)}
          title={title}
          subtitle={subtitle}
          metrics={metrics}
        />
        <main className="px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
