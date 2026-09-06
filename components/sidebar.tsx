'use client'

import { useState } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import { AlaesLogo } from '@/components/alaes-logo'
import { NAV } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function Sidebar({ open }: { open: boolean }) {
  const [active, setActive] = useState('Dashboard')
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-[72px] shrink-0 items-center border-b border-sidebar-border px-6">
        <AlaesLogo />
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = active === item.label
            const isOpen = expanded === item.label
            const hasChildren = !!item.children?.length
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(item.label)
                    if (hasChildren) {
                      setExpanded(isOpen ? null : item.label)
                    } else {
                      setExpanded(null)
                    }
                  }}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-primary'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive ? 'text-primary' : 'text-sidebar-foreground/60',
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 text-sidebar-foreground/50 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                    />
                  )}
                </button>

                {hasChildren && isOpen && (
                  <ul className="mb-1 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-4 ms-5">
                    {item.children!.map((child) => (
                      <li key={child}>
                        <button
                          type="button"
                          className="w-full truncate rounded-lg px-3 py-2 text-left text-[13px] text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        >
                          {child}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-t border-sidebar-border px-5 py-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
          A
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            Admin
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">
            Administrator
          </p>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </aside>
  )
}
