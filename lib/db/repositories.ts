import 'server-only'
import { isDbConfigured } from './config'
import { query } from './mssql'
import { USERS, type StaffUser } from '@/lib/system-admin-data'

/**
 * Data-access layer for System Admin entities.
 *
 * Each function tries SQL Server first when the connection is configured, and
 * falls back to the in-memory mock data otherwise. This lets the UI keep
 * working before the database is wired up, and switch to live data the moment
 * the MSSQL_* environment variables are present — no component changes needed.
 *
 * Replace the SQL below with the column/table names in your actual schema.
 */

export async function getUsers(): Promise<StaffUser[]> {
  if (!isDbConfigured()) return USERS

  const { recordset } = await query<StaffUser>(`
    SELECT
      Id           AS id,
      FullName     AS name,
      Email        AS email,
      Role         AS role,
      Department   AS department,
      Status       AS status,
      LastActive   AS lastActive
    FROM dbo.Users
    ORDER BY FullName
  `)
  return recordset
}

export async function getUserById(id: string): Promise<StaffUser | null> {
  if (!isDbConfigured()) return USERS.find((u) => u.id === id) ?? null

  const { recordset } = await query<StaffUser>(
    `SELECT
       Id AS id, FullName AS name, Email AS email, Role AS role,
       Department AS department, Status AS status, LastActive AS lastActive
     FROM dbo.Users
     WHERE Id = @id`,
    { id },
  )
  return recordset[0] ?? null
}
