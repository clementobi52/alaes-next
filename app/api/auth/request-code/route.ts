import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CodeEntry = { code: string; expiresAt: number; attempts: number }
type RuntimeStore = { codes: Map<string, CodeEntry> }
const runtimeStore = globalThis as typeof globalThis & { __alaesAuthStore?: RuntimeStore }
const codes = runtimeStore.__alaesAuthStore?.codes ?? new Map<string, CodeEntry>()
runtimeStore.__alaesAuthStore ??= { codes }

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.startsWith('0') ? `234${digits.slice(1)}` : digits
}

async function sendSms(phone: string, code: string) {
  const configuredUrl = process.env.BULK_SMS_NG_API_URL?.trim()
  const apiUrl = configuredUrl?.startsWith('BULK_SMS_NG_API_URL=')
    ? configuredUrl.slice('BULK_SMS_NG_API_URL='.length)
    : configuredUrl || 'https://account.bulk-sms.ng/api/promotional/send'
  const email = process.env.BULK_SMS_NG_EMAIL ?? process.env.BULK_SMS_NG_USERNAME
  const password = process.env.BULK_SMS_NG_PASSWORD
  const sender = (process.env.BULK_SMS_NG_SENDER ?? 'ALAES').slice(0, 11)
  if (!email || !password) throw new Error('Bulk SMS service is not configured.')

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      password,
      message: `Your ALAES sign-in code is ${code}. It expires in 10 minutes.`,
      recipient: phone,
      senderid: sender,
      smsgateway: '1',
    }),
    cache: 'no-store',
  })
  const responseBody = (await response.text()).trim()
  console.log('[v0] Bulk SMS provider response:', { status: response.status, body: responseBody.slice(0, 500) })
  if (!response.ok) throw new Error(`Bulk SMS request failed with ${response.status}: ${responseBody.slice(0, 200)}`)
  if (responseBody === '') throw new Error('Bulk SMS provider returned an empty response.')
  try {
    const result = JSON.parse(responseBody) as { status?: string; statusCode?: string; message?: string }
    if (String(result.status).toLowerCase() !== 'success' && result.statusCode !== '600' && result.statusCode !== '609') {
      throw new Error(result.message ?? `Bulk SMS rejected with code ${result.statusCode ?? 'unknown'}`)
    }
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Bulk SMS returned an invalid response: ${responseBody.slice(0, 200)}`)
    throw error
  }
}

export async function POST(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: 'SQL Server is not configured.' }, { status: 503 })
  const body = (await request.json()) as { username?: string }
  const username = body.username?.trim()
  if (!username) return NextResponse.json({ error: 'Username is required.' }, { status: 400 })
  try {
    const { recordset } = await query<{ id: string; name: string; phone_number: string }>(
      `SELECT TOP (1) id, name, phone_number FROM dbo.users WHERE username = @username OR email = @username`,
      { username },
    )
    const user = recordset[0]
    if (!user?.phone_number) return NextResponse.json({ error: 'No phone number is registered for this user.' }, { status: 404 })
    const phone = normalizePhone(user.phone_number)
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
