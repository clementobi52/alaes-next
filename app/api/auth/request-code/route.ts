import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CodeEntry = { code: string; expiresAt: number; attempts: number }
const codes = new Map<string, CodeEntry>()

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.startsWith('0') ? `234${digits.slice(1)}` : digits
}

async function sendSms(phone: string, code: string) {
  const apiUrl = process.env.BULK_SMS_NG_API_URL
  const username = process.env.BULK_SMS_NG_USERNAME
  const password = process.env.BULK_SMS_NG_PASSWORD
  const sender = process.env.BULK_SMS_NG_SENDER ?? 'ALAES'
  if (!apiUrl || !username || !password) throw new Error('Bulk SMS service is not configured.')
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password, sender, recipient: phone, message: `Your ALAES sign-in code is ${code}. It expires in 10 minutes.` }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Bulk SMS request failed with ${response.status}`)
}

export async function POST(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: 'SQL Server is not configured.' }, { status: 503 })
  const body = (await request.json()) as { username?: string }
  const username = body.username?.trim()
  if (!username) return NextResponse.json({ error: 'Username is required.' }, { status: 400 })
  try {
    const { recordset } = await query<{ id: string; name: string; phone: string }>(
      `SELECT TOP (1) id, name, phone AS phone FROM dbo.users WHERE username = @username OR email = @username`,
      { username },
    )
    const user = recordset[0]
    if (!user?.phone) return NextResponse.json({ error: 'No phone number is registered for this user.' }, { status: 404 })
    const phone = normalizePhone(user.phone)
    const code = crypto.randomInt(100000, 1000000).toString()
    await sendSms(phone, code)
    codes.set(String(user.id), { code, expiresAt: Date.now() + 10 * 60 * 1000, attempts: 0 })
    return NextResponse.json({ ok: true, userId: String(user.id), maskedPhone: `******${phone.slice(-4)}` })
  } catch (error) {
    console.error('[v0] SMS code request failed', error)
    return NextResponse.json({ error: 'Unable to send the sign-in code.' }, { status: 502 })
  }
}

export { codes }
