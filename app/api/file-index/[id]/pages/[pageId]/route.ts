import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; pageId: string }> }) {
  const { id, pageId } = await params
  try {
    const body = await request.json() as { pageType?: string; pageSubtype?: string; typedContent?: string; status?: string }
    if (!isDbConfigured()) return NextResponse.json({ page: { id: pageId, fileIndexId: id, ...body }, persisted: false, fallback: true })
    const { recordset } = await query(`UPDATE dbo.FileTypingPages SET PageType=COALESCE(@pageType,PageType), PageSubtype=@pageSubtype, TypedContent=@typedContent, Status=COALESCE(@status,Status), UpdatedAt=GETDATE() WHERE Id=@pageId AND FileIndexId=@id; SELECT Id AS id, FileIndexId AS fileIndexId, PageNumber AS pageNumber, PageType AS pageType, PageSubtype AS pageSubtype, TypedContent AS typedContent, Status AS status, UpdatedAt AS updatedAt FROM dbo.FileTypingPages WHERE Id=@pageId AND FileIndexId=@id`, { id, pageId, pageType: body.pageType?.trim() || null, pageSubtype: body.pageSubtype?.trim() || null, typedContent: body.typedContent?.trim() || null, status: body.status?.trim() || null })
    if (!recordset[0]) return NextResponse.json({ error: 'Page typing record not found.' }, { status: 404 })
    return NextResponse.json({ page: recordset[0], persisted: true })
  } catch { return NextResponse.json({ error: 'Unable to update page typing record.' }, { status: 500 }) }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; pageId: string }> }) {
  const { id, pageId } = await params
  if (!isDbConfigured()) return NextResponse.json({ error: 'Persistent database is not configured.' }, { status: 503 })
  try {
    const result = await query(`UPDATE dbo.FileTypingPages SET DeletedAt=GETDATE(), Status='deleted' WHERE Id=@pageId AND FileIndexId=@id`, { id, pageId })
    if (!result.rowsAffected[0]) return NextResponse.json({ error: 'Page typing record not found.' }, { status: 404 })
    return NextResponse.json({ deleted: true, id: pageId })
  } catch { return NextResponse.json({ error: 'Unable to delete page typing record.' }, { status: 500 }) }
}
