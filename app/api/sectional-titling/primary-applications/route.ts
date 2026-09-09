import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const value = (row: Record<string, unknown>, names: string[]) => {
  const key = Object.keys(row).find((candidate) => names.some((name) => candidate.toLowerCase() === name.toLowerCase()))
  return key ? row[key] : null
}

const textValue = (row: Record<string, unknown>, names: string[], fallback = '') => {
  const result = value(row, names)
  return result == null ? fallback : String(result)
}

const numberValue = (row: Record<string, unknown>, names: string[], fallback = 0) => {
  const result = Number(value(row, names))
  return Number.isFinite(result) ? result : fallback
}

const stage = (row: Record<string, unknown>, names: string[]) => ({
  status: textValue(row, names, 'Pending') as 'Captured' | 'Approved' | 'Pending' | 'Declined',
  date: textValue(row, [...names.map((name) => `${name}Date`), 'ApplicationDate'], '') || undefined,
})

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ ok: false, source: 'fallback', applications: [] })
  try {
    const result = await query<Record<string, unknown>>('SELECT TOP (500) * FROM dbo.mother_applications ORDER BY 1 DESC')
    const applications = result.recordset.map((row) => ({
      stFileNo: textValue(row, ['STFileNo', 'ST_FileNo']),
      mlsFileNo: textValue(row, ['MLSFileNo', 'MLS_FileNo']),
      property: textValue(row, ['Property', 'PropertyDescription', 'Location', 'Address']),
      type: textValue(row, ['Type', 'ApplicationType'], 'Primary Application'),
      landUse: textValue(row, ['LandUse', 'Land_Use'], 'Residential') as 'Residential' | 'Commercial' | 'Industrial' | 'Mixed-Use',
      owner: textValue(row, ['Owner', 'OwnerName', 'ApplicantName', 'Name']),
      passport: textValue(row, ['Passport', 'PassportPhoto', 'PassportImage', 'ApplicantPassport']) || null,
      units: {
        allocated: numberValue(row, ['AllocatedUnits', 'UnitsAllocated', 'Allocated']),
        total: numberValue(row, ['TotalUnits', 'UnitsTotal', 'Units'], 1),
      },
      applicationDate: textValue(row, ['ApplicationDate', 'DateApplied', 'CreatedAt']),
      dateCreated: textValue(row, ['DateCreated', 'CreatedAt', 'ApplicationDate']),
      createdBy: textValue(row, ['CreatedBy', 'SubmittedBy']),
      jsiStatus: stage(row, ['JSIStatus', 'JSI_Status']),
      jsiApproval: stage(row, ['JSIApproval', 'JSI_Approval']),
      planningRecommendation: stage(row, ['PlanningRecommendation', 'Planning_Recommendation']),
      directorApproval: stage(row, ['DirectorApproval', 'Director_Approval']),
    }))
    return NextResponse.json({ ok: true, source: 'mssql', applications })
  } catch (error) {
    console.error('[v0] Failed to load mother_applications', error)
    return NextResponse.json({ ok: false, source: 'mssql', applications: [], error: 'Unable to load applications' }, { status: 503 })
  }
}
