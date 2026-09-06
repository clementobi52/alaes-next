'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Database,
  Server,
  ShieldCheck,
  Plug,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import {
  SectionCard,
  SectionHeader,
  StatTile,
  StatusBadge,
} from '@/components/system-admin/primitives'
import { cn } from '@/lib/utils'

type Summary = {
  configured: boolean
  missing: string[]
  server: string | null
  port: number
  database: string | null
  user: string | null
  encrypt: boolean
  trustServerCertificate: boolean
}

type TestResult = {
  ok: boolean
  latencyMs?: number
  version?: string
  error?: string
}

const ENV_TEMPLATE = `MSSQL_SERVER=your-sql-server.database.windows.net
MSSQL_PORT=1433
MSSQL_DATABASE=ALAES
MSSQL_USER=alaes_app
MSSQL_PASSWORD=your-strong-password
MSSQL_ENCRYPT=true
MSSQL_TRUST_SERVER_CERTIFICATE=true`

export default function DatabaseConnectionPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [test, setTest] = useState<TestResult | null>(null)
  const [testing, setTesting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const loadSummary = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/system-admin/database', { cache: 'no-store' })
      setSummary((await res.json()) as Summary)
    } catch {
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  const runTest = useCallback(async () => {
    setTesting(true)
    setTest(null)
    try {
      const res = await fetch('/api/system-admin/database', { method: 'POST' })
      const data = (await res.json()) as TestResult & { summary?: Summary }
      setTest(data)
      if (data.summary) setSummary(data.summary)
    } catch (err) {
      setTest({
        ok: false,
        error: err instanceof Error ? err.message : 'Request failed',
      })
    } finally {
      setTesting(false)
    }
  }, [])

  const copyTemplate = useCallback(async () => {
    await navigator.clipboard.writeText(ENV_TEMPLATE)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [])

  const configured = summary?.configured ?? false

  return (
    <AppShell
      title="Database Connection"
      subtitle="Connect ALAES to your Microsoft SQL Server instance."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        {/* Status tiles */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatTile
            icon={Database}
            label="Configuration"
            value={loading ? '—' : configured ? 'Ready' : 'Incomplete'}
            tone={configured ? 'green' : 'amber'}
            hint={
              loading
                ? 'Checking environment…'
                : configured
                  ? 'All required variables set'
                  : `${summary?.missing.length ?? 0} variable(s) missing`
            }
          />
          <StatTile
            icon={Plug}
            label="Last connection test"
            value={
              testing ? 'Testing…' : !test ? 'Not tested' : test.ok ? 'Success' : 'Failed'
            }
            tone={!test ? 'neutral' : test.ok ? 'green' : 'red'}
            hint={
              test?.ok
                ? `Round-trip ${test.latencyMs}ms`
                : test?.error
                  ? 'See details below'
                  : 'Run a test to verify'
            }
          />
          <StatTile
            icon={ShieldCheck}
            label="Transport"
            value={summary?.encrypt ? 'Encrypted' : 'Plaintext'}
            tone={summary?.encrypt ? 'green' : 'amber'}
            hint={
              summary?.trustServerCertificate
                ? 'Trusting server certificate'
                : 'Validating server certificate'
            }
          />
        </div>

        {/* Connection details + test */}
        <SectionCard>
          <SectionHeader
            title="SQL Server connection"
            description="Values are read from server-side environment variables. Secrets are never sent to the browser."
            actions={
              <>
                <button
                  type="button"
                  onClick={loadSummary}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={runTest}
                  disabled={testing || !configured}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plug className="h-4 w-4" />
                  {testing ? 'Testing…' : 'Test connection'}
                </button>
              </>
            }
          />

          <dl className="grid gap-px overflow-hidden bg-border sm:grid-cols-2">
            <DetailRow icon={Server} label="Server" value={summary?.server} />
            <DetailRow label="Port" value={summary ? String(summary.port) : null} />
            <DetailRow icon={Database} label="Database" value={summary?.database} />
            <DetailRow label="Login" value={summary?.user} />
            <DetailRow
              label="Encrypt"
              value={summary ? (summary.encrypt ? 'true' : 'false') : null}
            />
            <DetailRow
              label="Trust server certificate"
              value={
                summary ? (summary.trustServerCertificate ? 'true' : 'false') : null
              }
            />
          </dl>

          {/* Test result banner */}
          {test && (
            <div className="p-5">
              <div
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4',
                  test.ok
                    ? 'border-chart-1/30 bg-chart-1/10'
                    : 'border-destructive/30 bg-destructive/10',
                )}
              >
                {test.ok ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-1" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {test.ok ? 'Connection successful' : 'Connection failed'}
                  </p>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {test.ok
                      ? test.version ?? 'Connected to SQL Server.'
                      : test.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Setup guidance */}
        <SectionCard>
          <SectionHeader
            title="Setup"
            description="Add these environment variables in Project Settings → Vars, then redeploy or restart the dev server."
            actions={
              <StatusBadge tone={configured ? 'green' : 'amber'}>
                {configured ? 'Configured' : 'Action needed'}
              </StatusBadge>
            }
          />
          <div className="space-y-4 p-5">
            {!configured && summary && summary.missing.length > 0 && (
              <div className="rounded-xl border border-chart-2/30 bg-chart-2/10 p-4">
                <p className="text-sm font-semibold text-chart-2">
                  Missing required variables
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {summary.missing.map((key) => (
                    <code
                      key={key}
                      className="rounded-md bg-background px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {key}
                    </code>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={copyTemplate}
                className="absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <pre className="scrollbar-thin overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-relaxed text-foreground">
                {ENV_TEMPLATE}
              </pre>
            </div>

            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Azure SQL:</span>{' '}
                keep <code className="font-mono text-xs">MSSQL_ENCRYPT=true</code>.
              </li>
              <li>
                <span className="font-medium text-foreground">On-prem / VM:</span>{' '}
                if the server uses a self-signed certificate, set{' '}
                <code className="font-mono text-xs">
                  MSSQL_TRUST_SERVER_CERTIFICATE=true
                </code>
                .
              </li>
              <li>
                Named instances: put the instance in{' '}
                <code className="font-mono text-xs">MSSQL_SERVER</code> as{' '}
                <code className="font-mono text-xs">host\\instance</code> and omit the
                port.
              </li>
            </ul>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Server
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="flex items-center gap-3 bg-card p-4">
      {Icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium">
          {value ?? <span className="text-muted-foreground">Not set</span>}
        </dd>
      </div>
    </div>
  )
}
