import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDbConfigured()) return NextResponse.json({ error: 'Persistent database is not configured.', id }, { status: 503 })
  try {
    const { recordset } = await query(`SELECT Id AS id, Schedule AS schedule, FilePrefix AS filePrefix, SerialNo AS serialNo, FileNumber AS fileNumber, TrackingId AS trackingId, CreatedAt AS createdAt FROM dbo.FileIndexRecords WHERE Id = @id`, { id })
    if (!recordset[0]) return NextResponse.json({ error: 'File index record not found.' }, { status: 404 })
    return NextResponse.json({ record: recordset[0], persisted: true })
  } catch { return NextResponse.json({ error: 'Unable to load the file index record.' }, { status: 500 }) }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json() as { schedule?: string; filePrefix?: string; serialNo?: number }
    const schedule = body.schedule?.trim()
    const filePrefix = body.filePrefix?.trim()
    const serialNo = Number(body.serialNo)
    if (!schedule || !filePrefix || !Number.isInteger(serialNo) || serialNo <= 0) return NextResponse.json({ error: 'Schedule, file prefix, and a positive serial number are required.' }, { status: 400 })
    if (!isDbConfigured()) return NextResponse.json({ error: 'Persistent database is not configured.' }, { status: 503 })
    const { recordset } = await query(`UPDATE dbo.FileIndexRecords SET Schedule=@schedule, FilePrefix=@filePrefix, SerialNo=@serialNo WHERE Id=@id; SELECT Id AS id, Schedule AS schedule, FilePrefix AS filePrefix, SerialNo AS serialNo, FileNumber AS fileNumber, TrackingId AS trackingId, CreatedAt AS createdAt FROM dbo.FileIndexRecords WHERE Id=@id`, { id, schedule, filePrefix, serialNo })
    if (!recordset[0]) return NextResponse.json({ error: 'File index record not found.' }, { status: 404 })
    return NextResponse.json({ record: recordset[0], persisted: true })
  } catch { return NextResponse.json({ error: 'Unable to update the file index record.' }, { status: 500 }) }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDbConfigured()) return NextResponse.json({ error: 'Persistent database is not configured.' }, { status: 503 })
  try {
    const result = await query(`DELETE FROM dbo.FileIndexRecords WHERE Id=@id`, { id })
    if (!result.rowsAffected[0]) return NextResponse.json({ error: 'File index record not found.' }, { status: 404 })
    return NextResponse.json({ deleted: true, id })
  } catch { return NextResponse.json({ error: 'Unable to delete the file index record.' }, { status: 500 }) }
}
