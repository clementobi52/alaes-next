import { compare } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'SQL Server is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as { username?: string; password?: string }
  const username = body.username?.trim()
  const password = body.password ?? ''

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 })
  }

  try {
    const result = await query<{ id: number; name: string; username: string; password: string }>(
      `SELECT TOP (1) id, name, username, password
       FROM dbo.users
       WHERE username = @username OR email = @username`,
      { username },
    )
    const user = result.recordset[0]
    const valid = user ? await compare(password, user.password.replace(/^\$2y\$/, '$2b$')) : false

    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, username: user.username } })
    response.cookies.set('alaes_user', String(user.id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return response
  } catch (error) {
    console.error('[v0] Sign-in database lookup failed', error)
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 })
  }
}
