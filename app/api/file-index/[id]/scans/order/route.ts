import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json() as { scanIds?: string[] }
    if (!Array.isArray(body.scanIds) || body.scanIds.length === 0) return NextResponse.json({ error: 'scanIds must be a non-empty array.' }, { status: 400 })
    if (!isDbConfigured()) return NextResponse.json({ fileIndexId: id, scanIds: body.scanIds, persisted: false, fallback: true })
    for (const [index, scanId] of body.scanIds.entries()) await query(`UPDATE dbo.FileScanAssets SET PageOrder=@pageOrder WHERE Id=@scanId AND FileIndexId=@id`, { id, scanId, pageOrder: index + 1 })
    return NextResponse.json({ fileIndexId: id, scanIds: body.scanIds, persisted: true })
  } catch { return NextResponse.json({ error: 'Unable to reorder scan assets.' }, { status: 500 }) }
}
