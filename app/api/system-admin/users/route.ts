import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CreateUserPayload = {
  name: string
  email: string
  username: string
  password: string
  phoneNumber?: string
  department?: string
  userType?: string
  rank?: string
  actions?: Record<'create' | 'view' | 'update' | 'delete', boolean>
  roles?: string[]
  pcAccess?: boolean
  onLeave?: boolean
  leaveStart?: string
  leaveEnd?: string
  deputy?: string
  leaveReason?: string
  oooFrom?: string
  oooTo?: string
  passport?: { name: string; type: string; data: string } | null
}

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'SQL Server is not configured.' }, { status: 503 })
  }

  try {
    const result = await query(`
      SELECT
        id, name, email, username, email_verified_at, created_at, updated_at,
        department, user_type, rank_name, can_create, can_view, can_update,
        can_delete, assigned_roles, pc_access, on_leave, leave_start, leave_end,
        deputy, leave_reason, out_of_office_from, out_of_office_to,
        passport_name, phone_number
      FROM dbo.users
      ORDER BY id DESC
    `)
    return NextResponse.json({ users: result.recordset })
  } catch {
    return NextResponse.json({ error: 'Unable to load users from SQL Server.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'SQL Server is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as CreateUserPayload
  if (!body.name?.trim() || !body.email?.trim() || !body.username?.trim() || !body.password) {
    return NextResponse.json({ error: 'Name, email, username, and password are required.' }, { status: 400 })
  }

  const passwordHash = await hash(body.password, 12)
  const actions = body.actions ?? { create: false, view: false, update: false, delete: false }
  const passportData = body.passport?.data ? Buffer.from(body.passport.data, 'base64') : null

  try {
    const result = await query<{ id: number }>(
      `INSERT INTO dbo.users
        (name, email, username, password, phone_number, department, user_type, rank_name,
         can_create, can_view, can_update, can_delete, assigned_roles, pc_access, on_leave,
         leave_start, leave_end, deputy, leave_reason, out_of_office_from, out_of_office_to,
         passport_name, passport_data, passport_type, created_at, updated_at)
       OUTPUT INSERTED.id AS id
       VALUES
        (@name, @email, @username, @password, @phone_number, @department, @user_type, @rank_name,
         @can_create, @can_view, @can_update, @can_delete, @assigned_roles, @pc_access, @on_leave,
         @leave_start, @leave_end, @deputy, @leave_reason, @out_of_office_from, @out_of_office_to,
         @passport_name, @passport_data, @passport_type, GETDATE(), GETDATE())`,
      {
        name: body.name.trim(), email: body.email.trim(), username: body.username.trim(), password: passwordHash,
        phone_number: body.phoneNumber?.trim() || null, department: body.department || null,
        user_type: body.userType || null, rank_name: body.rank?.trim() || null,
        can_create: Boolean(actions.create), can_view: Boolean(actions.view), can_update: Boolean(actions.update), can_delete: Boolean(actions.delete),
        assigned_roles: JSON.stringify(body.roles ?? []), pc_access: body.pcAccess !== false, on_leave: Boolean(body.onLeave),
        leave_start: body.leaveStart || null, leave_end: body.leaveEnd || null, deputy: body.deputy?.trim() || null,
        leave_reason: body.leaveReason?.trim() || null, out_of_office_from: body.oooFrom || null, out_of_office_to: body.oooTo || null,
        passport_name: body.passport?.name || null, passport_data: passportData, passport_type: body.passport?.type || null,
      },
    )

    return NextResponse.json({ ok: true, id: result.recordset[0]?.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create user.'
    const duplicate = /duplicate|unique|constraint/i.test(message)
    return NextResponse.json({ error: duplicate ? 'Username or email already exists.' : 'Unable to create user.' }, { status: duplicate ? 409 : 500 })
  }
}
