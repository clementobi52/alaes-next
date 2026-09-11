import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDbConfigured()) return NextResponse.json({ pages: [], persisted: false, fallback: true })
  try {
    const { recordset } = await query(`SELECT Id AS id, FileIndexId AS fileIndexId, PageNumber AS pageNumber, PageType AS pageType, PageSubtype AS pageSubtype, TypedContent AS typedContent, Status AS status, UpdatedAt AS updatedAt FROM dbo.FileTypingPages WHERE FileIndexId=@id AND DeletedAt IS NULL ORDER BY PageNumber ASC`, { id })
    return NextResponse.json({ pages: recordset, persisted: true, fallback: false })
  } catch { return NextResponse.json({ error: 'Unable to load page typing records.' }, { status: 500 }) }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json() as { pageNumber?: number; pageType?: string; pageSubtype?: string; typedContent?: string; status?: string }
    const pageNumber = Number(body.pageNumber)
    const pageType = body.pageType?.trim()
    const pageSubtype = body.pageSubtype?.trim() || null
    const typedContent = body.typedContent?.trim() || null
    const status = body.status?.trim() || 'in_progress'
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || !pageType) return NextResponse.json({ error: 'Page number and page type are required.' }, { status: 400 })
    if (!isDbConfigured()) return NextResponse.json({ page: { fileIndexId: id, pageNumber, pageType, pageSubtype, typedContent, status }, persisted: false, fallback: true }, { status: 201 })
    const { recordset } = await query(`INSERT INTO dbo.FileTypingPages (FileIndexId, PageNumber, PageType, PageSubtype, TypedContent, Status) OUTPUT INSERTED.Id AS id, INSERTED.FileIndexId AS fileIndexId, INSERTED.PageNumber AS pageNumber, INSERTED.PageType AS pageType, INSERTED.PageSubtype AS pageSubtype, INSERTED.TypedContent AS typedContent, INSERTED.Status AS status, INSERTED.UpdatedAt AS updatedAt VALUES (@id,@pageNumber,@pageType,@pageSubtype,@typedContent,@status)`, { id, pageNumber, pageType, pageSubtype, typedContent, status })
    return NextResponse.json({ page: recordset[0], persisted: true }, { status: 201 })
  } catch { return NextResponse.json({ error: 'Unable to save page typing record.' }, { status: 500 }) }
}
