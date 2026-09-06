'use client'

import { useMemo, useState } from 'react'
import { UserCheck, UserPlus, Users, UserX, MoreVertical, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  Field,
  Modal,
  SearchBar,
  SectionCard,
  SectionHeader,
  SelectInput,
  StatTile,
  StatusBadge,
  TextInput,
  type Tone,
} from '@/components/system-admin/primitives'
import {
  DEPARTMENTS,
  ROLES,
  USERS,
  type StaffUser,
  type UserStatus,
} from '@/lib/system-admin-data'
import { cn } from '@/lib/utils'

const STATUS_TONE: Record<UserStatus, Tone> = {
  active: 'green',
  suspended: 'red',
  invited: 'amber',
}
const STATUS_LABEL: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  invited: 'Invited',
}

export default function UserAccountsPage() {
  const [users, setUsers] = useState<StaffUser[]>(USERS)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: DEPARTMENTS[0].name,
    role: ROLES[0].name,
    status: 'active' as UserStatus,
  })

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = query.toLowerCase()
        const matchesQuery =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        const matchesRole = role === 'all' || u.role === role
        const matchesStatus = status === 'all' || u.status === status
        return matchesQuery && matchesRole && matchesStatus
      }),
    [users, query, role, status],
  )

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
      admins: users.filter((u) => u.role.includes('Administrator')).length,
    }),
    [users],
  )

  function setStatusFor(id: string, next: UserStatus) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)))
    setMenuId(null)
  }

  function addUser() {
    if (!form.name.trim() || !form.email.trim()) return
    setUsers((prev) => [
      {
        id: `u${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department,
        role: form.role,
        status: form.status,
        lastActive: form.status === 'invited' ? 'Never' : 'Just now',
      },
      ...prev,
    ])
    setOpen(false)
    setForm({ name: '', email: '', department: DEPARTMENTS[0].name, role: ROLES[0].name, status: 'active' })
  }

  return (
    <AppShell
      title="User Accounts"
      subtitle="Create, review and manage every ALAES staff account."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatTile icon={Users} label="Total accounts" value={stats.total} tone="blue" />
          <StatTile icon={UserCheck} label="Active" value={stats.active} tone="green" />
          <StatTile icon={UserX} label="Suspended" value={stats.suspended} tone="red" />
          <StatTile icon={ShieldCheck} label="Administrators" value={stats.admins} tone="violet" />
        </div>

        <SectionCard>
          <SectionHeader
            title="Staff directory"
            description={`${filtered.length} of ${users.length} accounts shown`}
            actions={
              <Button onClick={() => setOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Add user
              </Button>
            }
          />

          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search by name or email…"
              className="lg:max-w-sm lg:flex-1"
            />
            <div className="flex gap-3">
              <SelectInput value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="all">All roles</option>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </SelectInput>
              <SelectInput value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="invited">Invited</option>
              </SelectInput>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last active</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.department}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.role}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={STATUS_TONE[u.status]}>
                        {STATUS_LABEL[u.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.lastActive}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          aria-label={`Actions for ${u.name}`}
                          onClick={() => setMenuId((id) => (id === u.id ? null : u.id))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuId === u.id && (
                          <>
                            <button
                              type="button"
                              aria-hidden
                              tabIndex={-1}
                              onClick={() => setMenuId(null)}
                              className="fixed inset-0 z-10 cursor-default"
                            />
                            <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">
                              {u.status !== 'active' && (
                                <MenuItem onClick={() => setStatusFor(u.id, 'active')}>
                                  Activate
                                </MenuItem>
                              )}
                              {u.status !== 'suspended' && (
                                <MenuItem onClick={() => setStatusFor(u.id, 'suspended')} danger>
                                  Suspend
                                </MenuItem>
                              )}
                              <MenuItem onClick={() => setMenuId(null)}>Reset password</MenuItem>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                      No accounts match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add user account"
        description="Provision a new ALAES staff account and assign a role."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addUser}>Create account</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Full name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Chinwe Eze"
            />
          </Field>
          <Field label="Email address">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@alaes.ab.gov.ng"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Department">
              <SelectInput
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Role">
              <SelectInput
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <Field label="Initial status">
            <SelectInput
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })}
            >
              <option value="active">Active</option>
              <option value="invited">Invited (send email)</option>
            </SelectInput>
          </Field>
        </div>
      </Modal>
    </AppShell>
  )
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted',
        danger ? 'text-destructive' : 'text-foreground',
      )}
    >
      {children}
    </button>
  )
}
