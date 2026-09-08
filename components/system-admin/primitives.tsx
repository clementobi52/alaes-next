'use client'

import { useEffect, type ReactNode } from 'react'
import { Search, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Tones — shared status color language across every System Admin page  */
/* ------------------------------------------------------------------ */

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'neutral'

export const TONE_TEXT: Record<Tone, string> = {
  green: 'text-chart-1',
  amber: 'text-chart-2',
  red: 'text-destructive',
  blue: 'text-chart-3',
  violet: 'text-chart-4',
  neutral: 'text-muted-foreground',
}

export const TONE_SOFT: Record<Tone, string> = {
  green: 'bg-chart-1/15 text-chart-1',
  amber: 'bg-chart-2/15 text-chart-2',
  red: 'bg-destructive/15 text-destructive',
  blue: 'bg-chart-3/15 text-chart-3',
  violet: 'bg-chart-4/15 text-chart-4',
  neutral: 'bg-muted text-muted-foreground',
}

export const TONE_SOLID: Record<Tone, string> = {
  green: 'bg-chart-1 text-primary-foreground',
  amber: 'bg-chart-2 text-primary-foreground',
  red: 'bg-destructive text-white',
  blue: 'bg-chart-3 text-white',
  violet: 'bg-chart-4 text-white',
  neutral: 'bg-muted text-foreground',
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function SectionCard({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card', className)}>
      {children}
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stat tile                                                           */
/* ------------------------------------------------------------------ */

export function StatTile({
  icon: Icon,
  label,
  value,
  tone = 'green',
  hint,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  tone?: Tone
  hint?: string
}) {
  return (
    <SectionCard className="flex items-center gap-4 p-5">
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
          TONE_SOLID[tone],
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none tracking-tight">{value}</p>
        <p className="mt-1 truncate text-sm text-muted-foreground">{label}</p>
        {hint && <p className={cn('mt-0.5 text-xs', TONE_TEXT[tone])}>{hint}</p>}
      </div>
    </SectionCard>
  )
}

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

export function StatusBadge({
  tone,
  children,
  dot = true,
}: {
  tone: Tone
  children: ReactNode
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        TONE_SOFT[tone],
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', TONE_TEXT[tone].replace('text-', 'bg-'))}
        />
      )}
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Search input                                                        */
/* ------------------------------------------------------------------ */

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Toggle switch                                                       */
/* ------------------------------------------------------------------ */

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
        style={{ height: '1.125rem', width: '1.125rem' }}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Text field + select (form controls)                                 */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

const controlClass =
  'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, props.className)} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlClass, 'pr-8', props.className)} />
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

const AVATAR_TONES = [
  'bg-chart-1/20 text-chart-1',
  'bg-chart-2/20 text-chart-2',
  'bg-chart-3/20 text-chart-3',
  'bg-chart-4/20 text-chart-4',
  'bg-chart-5/20 text-chart-5',
]

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const tone =
    AVATAR_TONES[
      name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length
    ]
  return (
    <span
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
        tone,
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  widthClass = 'max-w-lg',
  printable = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  widthClass?: string
  printable?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      {...(printable ? { 'data-report-modal-root': '' } : {})}
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        {...(printable ? { 'data-report-backdrop': '' } : {})}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'scrollbar-thin relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl',
          widthClass,
        )}
        {...(printable ? { 'data-report-dialog': '' } : {})}
      >
        <div
          className="flex items-start justify-between gap-4 border-b border-border p-5"
          {...(printable ? { 'data-report-chrome': '' } : {})}
        >
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className="scrollbar-thin flex-1 overflow-y-auto p-5"
          {...(printable ? { 'data-report-scroll': '' } : {})}
        >
          {children}
        </div>
        {footer && (
          <div
            className="flex items-center justify-end gap-2 border-t border-border p-5"
            {...(printable ? { 'data-report-chrome': '' } : {})}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            active === t.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
