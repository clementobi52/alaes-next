'use client'

import { useMemo, useRef, useState } from 'react'
import {
  UserCheck,
  UserPlus,
  Users,
  UserX,
  MoreVertical,
  ShieldCheck,
  ListChecks,
  Umbrella,
  UploadCloud,
  Layers,
  X,
  CheckCircle,
} from 'lucide-react'
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
  Toggle,
  type Tone,
} from '@/components/system-admin/primitives'
import {
  AVAILABLE_ROLES,
  DEPARTMENTS,
  OFFICER_RANKS,
  ROLES,
  USER_LEVEL_BY_TYPE,
  USER_TYPES,
  USERS,
  type StaffUser,
  type UserStatus,
  type UserType,
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

type ActionKey = 'create' | 'view' | 'update' | 'delete'

type CreateUserForm = {
  name: string
  email: string
  username: string
  password: string
  phoneNumber: string
  department: string
  userType: UserType | ''
  rank: string
  actions: Record<ActionKey, boolean>
  roles: string[]
  pcAccess: boolean
  onLeave: boolean
  leaveStart: string
  leaveEnd: string
  deputy: string
  leaveReason: string
  oooFrom: string
  oooTo: string
  passport: File | null
}

const emptyForm: CreateUserForm = {
  name: '',
  email: '',
  username: '',
  password: '',
  phoneNumber: '',
  department: DEPARTMENTS[0].name,
  userType: '',
  rank: '',
  actions: { create: false, view: false, update: false, delete: false },
  roles: [],
  pcAccess: true,
  onLeave: false,
  leaveStart: '',
  leaveEnd: '',
  deputy: '',
  leaveReason: '',
  oooFrom: '',
  oooTo: '',
  passport: null,
}

export default function UserAccountsPage() {
  const [users, setUsers] = useState<StaffUser[]>(USERS)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [showAllRoles, setShowAllRoles] = useState(false)
  const [form, setForm] = useState<CreateUserForm>(emptyForm)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof CreateUserForm>(key: K, value: CreateUserForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const derivedLevel = form.userType ? USER_LEVEL_BY_TYPE[form.userType] : ''

  const visibleRoles = useMemo(() => {
    if (showAllRoles || !form.userType) return AVAILABLE_ROLES
    return AVAILABLE_ROLES.filter(
      (r) => r.group === form.userType || r.group === 'ALL',
    )
  }, [showAllRoles, form.userType])

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = query.toLowerCase()
        const matchesQuery =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
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

  function toggleAction(key: ActionKey) {
    setForm((f) => ({ ...f, actions: { ...f.actions, [key]: !f.actions[key] } }))
  }

  function toggleRole(name: string) {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(name)
        ? f.roles.filter((r) => r !== name)
        : [...f.roles, name],
    }))
  }

  function checkAllVisible() {
    setForm((f) => {
      const names = visibleRoles.map((r) => r.name)
      return { ...f, roles: Array.from(new Set([...f.roles, ...names])) }
    })
  }

  function uncheckAll() {
    set('roles', [])
  }

  function closeModal() {
    setOpen(false)
    setForm(emptyForm)
    setShowAllRoles(false)
    setPreviewUrl(null)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      set('passport', file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  function handleRemoveFile() {
    set('passport', null)
    setPreviewUrl(null)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  async function addUser() {
    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.password.trim()) return
    setSaving(true)
    setSaveError('')
    const passport = form.passport ? { name: form.passport.name, type: form.passport.type, data: await form.passport.arrayBuffer().then((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))) } : null
    const response = await fetch('/api/system-admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, passport }),
    })
    const result = await response.json()
    if (!response.ok) {
      setSaveError(result.error ?? 'Unable to create user.')
      setSaving(false)
      return
    }
    const roleLabel = form.roles[0] ?? (form.userType || 'Records Clerk')
    setUsers((prev) => [
      {
        id: `u${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        emailVerifiedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        department: form.department,
        role: roleLabel,
        status: form.onLeave ? 'invited' : 'active',
        lastActive: 'Just now',
        phoneNumber: form.phoneNumber.trim(),
        userType: form.userType || undefined,
        rank: form.rank.trim(),
        actions: form.actions,
        roles: form.roles,
        pcAccess: form.pcAccess,
        onLeave: form.onLeave,
        leaveStart: form.leaveStart,
        leaveEnd: form.leaveEnd,
        deputy: form.deputy.trim(),
        leaveReason: form.leaveReason.trim(),
        oooFrom: form.oooFrom,
        oooTo: form.oooTo,
        passportName: form.passport?.name,
      },
      ...prev,
    ])
    setSaving(false)
    closeModal()
  }

  // Helper function to format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
                  <th className="px-5 py-3 font-medium">Account details</th>
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
                          <p className="truncate text-xs text-muted-foreground">@{u.username} · {u.email}</p>
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
                    <td className="max-w-[260px] px-5 py-3 text-xs text-muted-foreground">
                      <div className="flex flex-wrap gap-1.5">
                        {u.phoneNumber && <span>{u.phoneNumber}</span>}
                        {u.userType && <span>{u.userType}</span>}
                        {u.rank && <span>{u.rank}</span>}
                        {u.pcAccess && <span>PC access</span>}
                        {u.onLeave && <span>On leave</span>}
                        {u.roles?.length ? <span>{u.roles.length} assigned role{u.roles.length === 1 ? '' : 's'}</span> : null}
                        {u.passportName && <span>Passport attached</span>}
                      </div>
                    </td>
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
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
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
        onClose={closeModal}
        title="Create User"
        description="Provision a new ALAES staff account with hierarchical roles and permissions."
        widthClass="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={addUser} disabled={saving}>{saving ? 'Saving…' : 'Create'}</Button>
          </>
        }
  >
  {saveError && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{saveError}</p>}
  <div className="flex flex-col gap-5">
          {/* Passport photo - UPDATED with preview and file management */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Passport Photo</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Upload a passport-sized photo (JPG, PNG, or GIF format, max 2MB)
            </p>
            
            {!form.passport ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-8 text-center transition-colors hover:border-primary/70 hover:bg-primary/10"
              >
                <UploadCloud className="h-7 w-7 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Click to upload passport photo
                </span>
                <span className="text-xs text-muted-foreground">JPG, PNG or GIF (max. 2MB)</span>
              </button>
            ) : (
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/20">
                <div className="flex items-start gap-4 p-4">
                  {/* Thumbnail preview */}
                  {previewUrl && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-border">
                      <img
                        src={previewUrl}
                        alt="Passport preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {form.passport.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(form.passport.size)}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600">Ready to upload</span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Identity - Added Username, Password, Phone Number */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <TextInput
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Chinwe Eze"
              />
            </Field>
            <Field label="Email address">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="name@alaes.ab.gov.ng"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Username">
              <TextInput
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                placeholder="e.g. chinwe.eze"
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Enter a secure password"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone Number">
              <TextInput
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => set('phoneNumber', e.target.value)}
                placeholder="e.g. +234 800 000 0000"
              />
            </Field>
          </div>

          {/* Hierarchical Role Management */}
          <TintCard tone="blue" icon={Layers} title="Hierarchical Role Management">
            <p className="text-sm text-chart-3">
              Follow the steps below to assign user roles. Each step filters the next to
              ensure data consistency.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Step 1: Select Department" hint="Choose the department to filter available roles">
                <SelectInput
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Step 2: Select User Type" hint="User level will be automatically determined">
                <SelectInput
                  value={form.userType}
                  onChange={(e) => set('userType', e.target.value as UserType)}
                >
                  <option value="">Select User Type</option>
                  {USER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Step 3: User Level (Auto-determined)" hint="Automatically set based on selected user type">
                <div className="flex h-10 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                  {derivedLevel || 'Select User Type First'}
                </div>
              </Field>
              <Legend title="Auto-Level Mapping">
                {USER_TYPES.map((t) => (
                  <li key={t}>
                    {t} → {USER_LEVEL_BY_TYPE[t]}
                  </li>
                ))}
              </Legend>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field
                label="Officer Rank (Seniority)"
                hint="Designation used to prioritise this officer's file search requests — the most senior requester is honored first."
              >
                <SelectInput value={form.rank} onChange={(e) => set('rank', e.target.value)}>
                  <option value="">Select Rank (optional)</option>
                  {OFFICER_RANKS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Legend title="Seniority (honored first):">
                {OFFICER_RANKS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </Legend>
            </div>
          </TintCard>

          {/* User Actions */}
          <TintCard tone="violet" icon={ListChecks} title="User Actions (user_actions)">
            <p className="text-sm text-chart-4">
              Select the specific actions this user is permitted to perform.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(['create', 'view', 'update', 'delete'] as ActionKey[]).map((a) => (
                <CheckItem
                  key={a}
                  checked={form.actions[a]}
                  onChange={() => toggleAction(a)}
                  label={a[0].toUpperCase() + a.slice(1)}
                />
              ))}
            </div>
          </TintCard>

          {/* Select Available Roles */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-foreground">
                Step 4: Select Available Roles
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={checkAllVisible}
                  className="rounded-lg bg-chart-1 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Check All Visible
                </button>
                <button
                  type="button"
                  onClick={uncheckAll}
                  className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Uncheck All
                </button>
              </div>
            </div>

            <div className="scrollbar-thin max-h-72 overflow-y-auto rounded-xl border border-border bg-background/40 p-2">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {visibleRoles.map((r) => (
                  <label
                    key={r.name}
                    className="flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      checked={form.roles.includes(r.name)}
                      onChange={() => toggleRole(r.name)}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm leading-tight text-foreground">{r.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.group} · {r.level}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {form.roles.length} role{form.roles.length === 1 ? '' : 's'} selected
              </span>
              <button
                type="button"
                onClick={() => setShowAllRoles((v) => !v)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  showAllRoles
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground hover:opacity-90',
                )}
              >
                {showAllRoles ? 'Enable Hierarchical Filter' : 'Show All Roles'}
              </button>
            </div>
            {showAllRoles && (
              <p className="mt-2 text-xs font-medium text-chart-2">
                ⚠ Showing all roles — hierarchical filtering disabled
              </p>
            )}
          </div>

          {/* PC Access */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">PC Access</h4>
            <div className="mt-2 flex items-center gap-3">
              <Toggle
                checked={form.pcAccess}
                onChange={(v) => set('pcAccess', v)}
                label="User has PC/computer access"
              />
              <span className="text-sm text-foreground">User has PC/computer access</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Toggle OFF for staff requiring manual attendance.
            </p>
          </div>

          {/* Holiday / Leave & Deputy Redirection */}
          <TintCard tone="amber" icon={Umbrella} title="Holiday/Leave & Deputy Redirection">
            <p className="text-sm text-chart-2">
              Applicable to MLPP staff — record leave status and who should receive their
              file/task redirects while away.
            </p>
            <div className="mt-3">
              <CheckItem
                checked={form.onLeave}
                onChange={() => set('onLeave', !form.onLeave)}
                label="Mark this staff member as currently on leave/holiday"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Leave Start Date">
                <TextInput
                  type="date"
                  value={form.leaveStart}
                  onChange={(e) => set('leaveStart', e.target.value)}
                />
              </Field>
              <Field label="Leave End Date">
                <TextInput
                  type="date"
                  value={form.leaveEnd}
                  onChange={(e) => set('leaveEnd', e.target.value)}
                />
              </Field>
              <Field
                label="Deputy (Redirect To)"
                hint="Colleague who receives this user's file/task redirects while on leave."
              >
                <SelectInput value={form.deputy} onChange={(e) => set('deputy', e.target.value)}>
                  <option value="">Select deputy</option>
                  {USERS.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Leave Reason">
                <TextInput
                  value={form.leaveReason}
                  onChange={(e) => set('leaveReason', e.target.value)}
                  placeholder="e.g. Annual Leave, Sick Leave, Study"
                />
              </Field>
              <Field label="Out of Office Date From">
                <TextInput
                  type="date"
                  value={form.oooFrom}
                  onChange={(e) => set('oooFrom', e.target.value)}
                />
              </Field>
              <Field label="Out of Office Date To">
                <TextInput
                  type="date"
                  value={form.oooTo}
                  onChange={(e) => set('oooTo', e.target.value)}
                />
              </Field>
            </div>
          </TintCard>
        </div>
      </Modal>
    </AppShell>
  )
}

/* ------------------------------------------------------------------ */
/* Local helpers                                                       */
/* ------------------------------------------------------------------ */

const TINT: Record<'blue' | 'violet' | 'amber', string> = {
  blue: 'border-chart-3/30 bg-chart-3/10',
  violet: 'border-chart-4/30 bg-chart-4/10',
  amber: 'border-chart-2/30 bg-chart-2/10',
}
const TINT_ICON: Record<'blue' | 'violet' | 'amber', string> = {
  blue: 'text-chart-3',
  violet: 'text-chart-4',
  amber: 'text-chart-2',
}

function TintCard({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: 'blue' | 'violet' | 'amber'
  icon: typeof Layers
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-xl border p-4', TINT[tone])}>
      <div className="flex items-center gap-2">
        <Icon className={cn('h-5 w-5', TINT_ICON[tone])} />
        <h4 className={cn('text-base font-semibold', TINT_ICON[tone])}>{title}</h4>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function Legend({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">{children}</ul>
    </div>
  )
}

function CheckItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 accent-primary"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
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
