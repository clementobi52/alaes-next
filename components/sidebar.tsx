'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogOut } from 'lucide-react'
import { AlaesLogo } from '@/components/alaes-logo'
import { NAV, findActiveChain, type NavModule, type NavNode } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()

  // Expanded group paths, keyed by full path so repeated labels never collide.
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(findActiveChain(pathname)),
  )
  // Highlight fallback for hrefless leaves; routed leaves use the pathname.
  const [active, setActive] = useState('')

  // When the route changes, auto-expand the ancestors of the active leaf.
  useEffect(() => {
    const chain = findActiveChain(pathname)
    if (chain.length) {
      setExpanded((prev) => new Set([...prev, ...chain]))
    }
  }, [pathname])

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const shared: SharedProps = {
    pathname,
    active,
    expanded,
    setActive,
    toggle,
    onNavigate,
  }

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
          {NAV.map((mod) => (
            <ModuleItem key={mod.label} module={mod} {...shared} />
          ))}
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

type SharedProps = {
  pathname: string
  active: string
  expanded: Set<string>
  setActive: (path: string) => void
  toggle: (path: string) => void
  onNavigate?: () => void
}

/** Row shell shared by routed leaves (Link), hrefless leaves and groups (button). */
function Row({
  href,
  isActive,
  onClick,
  onNavigate,
  className,
  children,
}: {
  href?: string
  isActive: boolean
  onClick?: () => void
  onNavigate?: () => void
  className: string
  children: React.ReactNode
}) {
  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className={className} aria-current={isActive ? 'page' : undefined}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  )
}

function ModuleItem({ module, ...shared }: { module: NavModule } & SharedProps) {
  const { pathname, active, expanded, setActive, toggle, onNavigate } = shared
  const path = module.label
  const hasChildren = !!module.children?.length
  const isOpen = expanded.has(path)
  const isActive = module.href ? pathname === module.href : active === path

  return (
    <li>
      <Row
        href={hasChildren ? undefined : module.href}
        isActive={isActive}
        onNavigate={onNavigate}
        onClick={() => (hasChildren ? toggle(path) : setActive(path))}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-accent text-primary'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )}
      >
        <module.icon
          className={cn(
            'h-[18px] w-[18px] shrink-0',
            isActive ? 'text-primary' : 'text-sidebar-foreground/60',
          )}
        />
        <span className="flex-1 truncate">{module.label}</span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-sidebar-foreground/50 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        )}
      </Row>

      {hasChildren && isOpen && (
        <ul className="mb-1 ms-5 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
          {module.children!.map((child) => (
            <NavBranch key={child.label} node={child} parentPath={path} {...shared} />
          ))}
        </ul>
      )}
    </li>
  )
}

function NavBranch({
  node,
  parentPath,
  ...shared
}: { node: NavNode; parentPath: string } & SharedProps) {
  const { pathname, active, expanded, setActive, toggle, onNavigate } = shared
  const path = `${parentPath}/${node.label}`
  const hasChildren = !!node.children?.length
  const isOpen = expanded.has(path)
  const isActive = node.href ? pathname === node.href : active === path

  return (
    <li>
      <Row
        href={hasChildren ? undefined : node.href}
        isActive={isActive}
        onNavigate={onNavigate}
        onClick={() => (hasChildren ? toggle(path) : setActive(path))}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors',
          isActive
            ? 'bg-sidebar-accent/70 text-primary'
            : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )}
      >
        <span className="flex-1 truncate">{node.label}</span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        )}
      </Row>

      {hasChildren && isOpen && (
        <ul className="ms-3 mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
          {node.children!.map((child) => (
            <NavBranch key={child.label} node={child} parentPath={path} {...shared} />
          ))}
        </ul>
      )}
    </li>
  )
}
