import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDbConfigured()) return NextResponse.json({ scans: [], persisted: false, fallback: true })
  try {
    const { recordset } = await query(`SELECT Id AS id, FileIndexId AS fileIndexId, FileName AS fileName, PageOrder AS pageOrder, Status AS status, CreatedAt AS createdAt FROM dbo.FileScanAssets WHERE FileIndexId=@id AND DeletedAt IS NULL ORDER BY PageOrder ASC`, { id })
    return NextResponse.json({ scans: recordset, persisted: true, fallback: false })
  } catch { return NextResponse.json({ error: 'Unable to load scan assets.' }, { status: 500 }) }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json() as { fileName?: string; pageOrder?: number; status?: string }
    const fileName = body.fileName?.trim()
    const pageOrder = Number(body.pageOrder ?? 1)
    const status = body.status?.trim() || 'queued'
    if (!fileName || !Number.isInteger(pageOrder) || pageOrder < 1) return NextResponse.json({ error: 'A file name and positive page order are required.' }, { status: 400 })
    if (!isDbConfigured()) return NextResponse.json({ scan: { fileIndexId: id, fileName, pageOrder, status }, persisted: false, fallback: true }, { status: 201 })
    const { recordset } = await query(`INSERT INTO dbo.FileScanAssets (FileIndexId, FileName, PageOrder, Status) OUTPUT INSERTED.Id AS id, INSERTED.FileIndexId AS fileIndexId, INSERTED.FileName AS fileName, INSERTED.PageOrder AS pageOrder, INSERTED.Status AS status, INSERTED.CreatedAt AS createdAt VALUES (@id,@fileName,@pageOrder,@status)`, { id, fileName, pageOrder, status })
    return NextResponse.json({ scan: recordset[0], persisted: true }, { status: 201 })
  } catch { return NextResponse.json({ error: 'Unable to register scan asset.' }, { status: 500 }) }
}
