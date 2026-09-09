import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const value = (row: Record<string, unknown>, names: string[]) => {
  const key = Object.keys(row).find((candidate) => names.some((name) => candidate.toLowerCase() === name.toLowerCase()))
  return key ? row[key] : null
}

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ ok: false, source: 'fallback', applications: [] })
  try {
    const result = await query<Record<string, unknown>>('SELECT TOP (500) * FROM dbo.mother_applications ORDER BY 1 DESC')
    const applications = result.recordset.map((row) => ({
      ...row,
      stFileNo: value(row, ['STFileNo', 'STFileNo', 'ST_FileNo']) ?? '',
      mlsFileNo: value(row, ['MLSFileNo', 'MLS_FileNo']) ?? '',
      owner: value(row, ['Owner', 'OwnerName', 'ApplicantName', 'Name']) ?? '',
      passport: value(row, ['Passport', 'PassportPhoto', 'PassportImage', 'ApplicantPassport']) ?? null,
    }))
    return NextResponse.json({ ok: true, source: 'mssql', applications })
  } catch (error) {
    console.error('[v0] Failed to load mother_applications', error)
    return NextResponse.json({ ok: false, source: 'mssql', applications: [], error: 'Unable to load applications' }, { status: 503 })
  }
}
