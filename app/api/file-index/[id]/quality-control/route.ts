import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDbConfigured()) return NextResponse.json({ fileIndexId: id, status: 'quality-control', persisted: false, fallback: true })
  try {
    const result = await query(`UPDATE dbo.FileIndexRecords SET Status='quality-control', UpdatedAt=GETDATE() WHERE Id=@id`, { id })
    if (!result.rowsAffected[0]) return NextResponse.json({ error: 'File index record not found.' }, { status: 404 })
    return NextResponse.json({ fileIndexId: id, status: 'quality-control', persisted: true })
  } catch { return NextResponse.json({ error: 'Unable to submit file for quality control.' }, { status: 500 }) }
}
