import 'server-only'
import sql, { type ConnectionPool, type IResult } from 'mssql'
import { buildDbConfig } from './config'

/**
 * A single shared connection pool per server process. Cached on globalThis so
 * Next.js hot-reloads in development reuse the pool instead of opening a new
 * one on every module refresh (which would exhaust server connections).
 */
const globalForDb = globalThis as unknown as {
  __alaesMssqlPool?: Promise<ConnectionPool>
}

export function getPool(): Promise<ConnectionPool> {
  if (!globalForDb.__alaesMssqlPool) {
    const pool = new sql.ConnectionPool(buildDbConfig())
    globalForDb.__alaesMssqlPool = pool.connect().catch((err) => {
      // Reset on failure so the next call retries a fresh connection.
      globalForDb.__alaesMssqlPool = undefined
      throw err
    })
  }
  return globalForDb.__alaesMssqlPool
}

export type QueryParams = Record<string, unknown>

/**
 * Run a parameterized query. Always pass user input through `params` (never
 * string-concatenate into `text`) so the driver binds values safely and
 * prevents SQL injection.
 *
 * @example
 * const { recordset } = await query(
 *   'SELECT * FROM Users WHERE Department = @dept',
 *   { dept: 'Deeds' },
 * )
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: QueryParams = {},
): Promise<IResult<T>> {
  const pool = await getPool()
  const request = pool.request()
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value)
  }
  return request.query<T>(text)
}

/** Verify connectivity with a trivial round-trip. Used by the health check. */
export async function ping(): Promise<{ ok: true; version: string }> {
  const result = await query<{ version: string }>(
    'SELECT @@VERSION AS version',
  )
  return { ok: true, version: result.recordset[0]?.version ?? 'unknown' }
}

/** Close the pool (useful for graceful shutdown or config changes). */
export async function closePool(): Promise<void> {
  if (globalForDb.__alaesMssqlPool) {
    const pool = await globalForDb.__alaesMssqlPool
    await pool.close()
    globalForDb.__alaesMssqlPool = undefined
  }
}

export { sql }
