import { NextResponse } from 'next/server'
import { dbConfigSummary, isDbConfigured } from '@/lib/db/config'
import { ping } from '@/lib/db/mssql'

// mssql/tedious relies on Node TCP sockets — it cannot run on the Edge runtime.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET: non-secret summary of the current SQL Server configuration. */
export function GET() {
  return NextResponse.json(dbConfigSummary())
}

/** POST: attempt a live connection and round-trip query against SQL Server. */
export async function POST() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'SQL Server is not configured. Add the MSSQL_* environment variables first.',
        summary: dbConfigSummary(),
      },
      { status: 400 },
    )
  }

  const startedAt = Date.now()
  try {
    const result = await ping()
    return NextResponse.json({
      ok: true,
      latencyMs: Date.now() - startedAt,
      version: result.version,
      summary: dbConfigSummary(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        latencyMs: Date.now() - startedAt,
        error: err instanceof Error ? err.message : 'Unknown connection error',
        summary: dbConfigSummary(),
      },
      { status: 502 },
    )
  }
}
