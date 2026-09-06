import type { config as MssqlConfig } from 'mssql'

/**
 * Environment variables that describe the SQL Server connection. All are read
 * server-side only; none are exposed to the browser.
 */
export const DB_ENV_KEYS = [
  'MSSQL_SERVER',
  'MSSQL_PORT',
  'MSSQL_DATABASE',
  'MSSQL_USER',
  'MSSQL_PASSWORD',
  'MSSQL_ENCRYPT',
  'MSSQL_TRUST_SERVER_CERTIFICATE',
] as const

/** True when the minimum required variables for a connection are present. */
export function isDbConfigured(): boolean {
  return Boolean(
    process.env.MSSQL_SERVER &&
      process.env.MSSQL_DATABASE &&
      process.env.MSSQL_USER &&
      process.env.MSSQL_PASSWORD,
  )
}

/** Which required variables are still missing, for diagnostics in the UI. */
export function missingDbEnv(): string[] {
  return ['MSSQL_SERVER', 'MSSQL_DATABASE', 'MSSQL_USER', 'MSSQL_PASSWORD'].filter(
    (key) => !process.env[key],
  )
}

function boolEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
}

/**
 * Build the `mssql` pool config from environment variables. Throws a clear
 * error when required variables are missing so callers fail loudly.
 */
export function buildDbConfig(): MssqlConfig {
  const missing = missingDbEnv()
  if (missing.length > 0) {
    throw new Error(
      `SQL Server is not configured. Missing environment variables: ${missing.join(', ')}`,
    )
  }

  return {
    server: process.env.MSSQL_SERVER as string,
    port: process.env.MSSQL_PORT ? Number(process.env.MSSQL_PORT) : 1433,
    database: process.env.MSSQL_DATABASE as string,
    user: process.env.MSSQL_USER as string,
    password: process.env.MSSQL_PASSWORD as string,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30_000,
    },
    options: {
      // Azure SQL requires encryption; on-prem servers usually enable it too.
      encrypt: boolEnv(process.env.MSSQL_ENCRYPT, true),
      // Self-signed certs on internal servers need this set to true.
      trustServerCertificate: boolEnv(
        process.env.MSSQL_TRUST_SERVER_CERTIFICATE,
        true,
      ),
      enableArithAbort: true,
    },
    connectionTimeout: 15_000,
    requestTimeout: 30_000,
  }
}

/** Non-secret summary of the current config for display in the admin UI. */
export function dbConfigSummary() {
  return {
    configured: isDbConfigured(),
    missing: missingDbEnv(),
    server: process.env.MSSQL_SERVER ?? null,
    port: process.env.MSSQL_PORT ? Number(process.env.MSSQL_PORT) : 1433,
    database: process.env.MSSQL_DATABASE ?? null,
    user: process.env.MSSQL_USER ?? null,
    encrypt: boolEnv(process.env.MSSQL_ENCRYPT, true),
    trustServerCertificate: boolEnv(
      process.env.MSSQL_TRUST_SERVER_CERTIFICATE,
      true,
    ),
  }
}
