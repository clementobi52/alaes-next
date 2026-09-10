import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) return new NextResponse(null, { status: 404 })
  const { id } = await params
  const result = await query<{ passport_data: Buffer | Uint8Array | null; passport_type: string | null }>(
    'SELECT passport_data, passport_type FROM dbo.users WHERE id = @id',
    { id: Number(id) },
  )
  const user = result.recordset[0]
  if (!user?.passport_data) return new NextResponse(null, { status: 404 })
  return new NextResponse(Buffer.from(user.passport_data), {
    headers: {
      'Content-Type': user.passport_type || 'image/jpeg',
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
