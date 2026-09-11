import { NextResponse } from 'next/server'
import { codes } from '@/app/api/auth/request-code/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string; code?: string }
  const userId = body.userId?.trim()
  const code = body.code?.trim()
  if (!userId || !code) return NextResponse.json({ error: 'Verification details are required.' }, { status: 400 })
  const entry = codes.get(userId)
  if (!entry || entry.expiresAt < Date.now()) return NextResponse.json({ error: 'This code has expired. Request a new code.' }, { status: 401 })
  if (entry.attempts >= 5) return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 })
  entry.attempts += 1
  if (entry.code !== code) return NextResponse.json({ error: 'The sign-in code is incorrect.' }, { status: 401 })
  codes.delete(userId)
  const response = NextResponse.json({ ok: true })
  response.cookies.set('alaes_user', userId, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
