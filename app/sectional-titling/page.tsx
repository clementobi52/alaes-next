import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  Home,
  FileCheck,
  Clock,
  ArrowUp,
  ArrowDown,
  Users,
  LayoutGrid,
  MapPin,
  Settings,
  Check,
  CheckCircle2,
  Building2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import {
  SectionCard,
  SectionHeader,
  StatusBadge,
  Avatar,
} from '@/components/system-admin/primitives'
import {
  OVERVIEW_STATS,
  SERVICE_AREAS,
  APPLICATION_FLOW,
  RECENT_APPLICATIONS,
  statusTone,
} from '@/lib/sectional-titling-data'

export const metadata: Metadata = {
  title: 'Sectional Titling | ALAES',
  description:
    'Process Certificates of Occupancy for individually owned sections of multi-unit developments in Abia State.',
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  'layout-grid': LayoutGrid,
  'map-pin': MapPin,
  settings: Settings,
}

const STAT_CARDS = [
  {
    label: 'Mother Applications',
    hint: 'Total mother applications',
    value: OVERVIEW_STATS.motherApplications,
    delta: '+8% from last month',
    up: true,
    icon: FileText,
  },
  {
    label: 'Secondary Applications',
    hint: 'Total unit applications',
    value: OVERVIEW_STATS.secondaryApplications,
    delta: '+12% from last month',
    up: true,
    icon: Home,
  },
  {
    label: 'Certificates Issued',
    hint: 'Total CofO issued',
    value: OVERVIEW_STATS.certificatesIssued,
    delta: '+15% from last month',
    up: true,
    icon: FileCheck,
  },
  {
    label: 'Pending Applications',
    hint: 'Applications awaiting action',
    value: OVERVIEW_STATS.pendingApplications,
    delta: '-5% from last month',
    up: false,
    icon: Clock,
  },
]

export default function SectionalTitlingOverviewPage() {
  return (
    <AppShell
      title="Sectional Titling Module"
      subtitle="Process CofO for individually owned sections of multi-unit developments."
      metrics={[]}
    >
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map((c) => (
            <SectionCard key={c.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{c.label}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>
                </div>
                <c.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight">{c.value}</div>
              <div
                className={`mt-2 flex items-center gap-1 text-sm ${
                  c.up ? 'text-primary' : 'text-destructive'
                }`}
              >
                {c.up ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{c.delta}</span>
              </div>
            </SectionCard>
          ))}
        </div>

        {/* Mandate */}
        <SectionCard>
          <SectionHeader
            title="Sectional Titling Mandate"
            description="Department overview and responsibilities"
          />
          <p className="p-5 text-sm leading-relaxed text-muted-foreground text-pretty">
            The Sectional Titling Department is responsible for processing Certificates of
            Occupancy (CofO) for individually owned sections of multi-unit developments (e.g.
            plazas, story buildings, offices, apartments) in both 2D/3D formats, ensuring the
            capture of ownership rights over individual units and common property governed by a
            Body Corporate.
          </p>
        </SectionCard>

        {/* Service areas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICE_AREAS.map((area) => {
            const Icon = SERVICE_ICONS[area.icon] ?? Settings
            return (
              <SectionCard key={area.title} className="p-5">
                <div className="mb-4 flex flex-col items-center text-center">
                  <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-semibold">{area.title}</h3>
                </div>
                <ul className="space-y-2">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )
          })}
        </div>

        {/* Application flow */}
        <SectionCard>
          <SectionHeader
            title="Application Flow"
            description="Sectional titling application process"
          />
          <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
            {[APPLICATION_FLOW.mother, APPLICATION_FLOW.secondary].map((flow, i) => (
              <div
                key={flow.title}
                className="flex flex-col rounded-xl border border-border p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  {i === 0 ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <Home className="h-5 w-5 text-primary" />
                  )}
                  <h3 className="font-semibold">{flow.title}</h3>
                </div>
                <p className="mb-4 text-sm text-muted-foreground text-pretty">
                  {flow.description}
                </p>
                <ul className="mb-5 space-y-2.5">
                  {flow.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={
                    i === 0
                      ? '/sectional-titling/applications/primary'
                      : '/sectional-titling'
                  }
                  className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {i === 0 ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <Home className="h-4 w-4" />
                  )}
                  {i === 0 ? 'Create Mother Application' : 'Secondary Applications'}
                </Link>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent applications */}
        <SectionCard>
          <SectionHeader
            title="Recent Applications"
            description="Latest sectional title applications"
            actions={
              <Link
                href="/sectional-titling/applications/primary"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">File No</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Applicant</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_APPLICATIONS.map((app) => (
                  <tr
                    key={app.fileNo}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3 font-medium text-primary">{app.fileNo}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {app.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={app.applicant} />
                        <span className="truncate">{app.applicant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={statusTone(app.status)}>{app.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}
