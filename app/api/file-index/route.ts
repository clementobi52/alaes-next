import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

function buildTrackingId(serialNo: number) {
  return `TRK-AB-${new Date().getFullYear()}-${String(serialNo).padStart(5, '0')}`
}

const fallbackRecords = [
  { id: 'fallback-1', fileNumber: 'LUAC/AB/03517/AB', filePrefix: 'LUAC/AB', serialNo: 3517, schedule: 'AB', trackingId: 'TRK-AB-2026-03517', createdAt: null },
  { id: 'fallback-2', fileNumber: 'LUAC/AB/02894/UM', filePrefix: 'LUAC/AB', serialNo: 2894, schedule: 'UM', trackingId: 'TRK-AB-2026-02894', createdAt: null },
]

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ records: fallbackRecords, persisted: false, fallback: true })
  try {
    const { recordset } = await query(`SELECT Id AS id, Schedule AS schedule, FilePrefix AS filePrefix, SerialNo AS serialNo, FileNumber AS fileNumber, TrackingId AS trackingId, CreatedAt AS createdAt FROM dbo.FileIndexRecords ORDER BY CreatedAt DESC`)
    return NextResponse.json({ records: recordset, persisted: true, fallback: false })
  } catch (error) {
    console.error('[v0] file index fetch failed', error)
    return NextResponse.json({ records: fallbackRecords, persisted: false, fallback: true, error: 'Database unavailable; showing fallback records.' })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { schedule?: string; filePrefix?: string; serialNo?: number }
    const schedule = body.schedule?.trim()
    const filePrefix = body.filePrefix?.trim()
    const serialNo = Number(body.serialNo)
    if (!schedule || !filePrefix || !Number.isInteger(serialNo) || serialNo <= 0) {
      return NextResponse.json({ error: 'Schedule, file prefix, and a positive serial number are required.' }, { status: 400 })
    }
    const fileNumber = `${filePrefix}/${serialNo}/${schedule}`
    const trackingId = buildTrackingId(serialNo)
    if (!isDbConfigured()) {
      return NextResponse.json({ record: { schedule, filePrefix, serialNo, fileNumber, trackingId }, persisted: false })
    }
    const { recordset } = await query(`
      INSERT INTO dbo.FileIndexRecords (Schedule, FilePrefix, SerialNo)
      OUTPUT INSERTED.Id AS id, INSERTED.Schedule AS schedule, INSERTED.FilePrefix AS filePrefix,
        INSERTED.SerialNo AS serialNo, INSERTED.FileNumber AS fileNumber, INSERTED.TrackingId AS trackingId,
        INSERTED.CreatedAt AS createdAt
      VALUES (@schedule, @filePrefix, @serialNo)
    `, { schedule, filePrefix, serialNo })
    return NextResponse.json({ record: recordset[0], persisted: true }, { status: 201 })
  } catch (error) {
    console.error('[v0] file index save failed', error)
    return NextResponse.json({ error: 'Unable to save the file index record.' }, { status: 500 })
  }
}
