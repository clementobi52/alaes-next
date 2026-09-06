'use client'

import { useMemo, useState } from 'react'
import { Plus, ShieldCheck, Check } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Field,
  Modal,
  SectionCard,
  SectionHeader,
  TextInput,
  Toggle,
  StatusBadge,
} from '@/components/system-admin/primitives'
import {
  PERMISSION_MODULES,
  ROLES,
  type PermissionAction,
  type PermissionModule,
  type Role,
} from '@/lib/system-admin-data'
import { cn } from '@/lib/utils'

const ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete']
const ACTION_LABEL: Record<PermissionAction, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
}

export default function UserRolesPage() {
  const [roles, setRoles] = useState<Role[]>(ROLES)
  const [selectedId, setSelectedId] = useState(ROLES[0].id)
  const [dirty, setDirty] = useState(false)
  const [open, setOpen] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', description: '' })

  const selected = useMemo(
    () => roles.find((r) => r.id === selectedId) ?? roles[0],
    [roles, selectedId],
  )

  const grantedCount = useMemo(() => {
    let n = 0
    for (const m of PERMISSION_MODULES) for (const a of ACTIONS) if (selected.permissions[m][a]) n++
    return n
  }, [selected])

  function togglePermission(module: PermissionModule, action: PermissionAction) {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [module]: {
                  ...r.permissions[module],
                  [action]: !r.permissions[module][action],
                },
              },
            }
          : r,
      ),
    )
    setDirty(true)
  }

  function toggleModuleAll(module: PermissionModule, value: boolean) {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [module]: { view: value, create: value, edit: value, delete: value },
              },
            }
          : r,
      ),
    )
    setDirty(true)
  }

  function addRole() {
    if (!newRole.name.trim()) return
    const blank = {} as Role['permissions']
    for (const m of PERMISSION_MODULES) blank[m] = { view: false, create: false, edit: false, delete: false }
    const role: Role = {
      id: `r${Date.now()}`,
      name: newRole.name.trim(),
      description: newRole.description.trim() || 'Custom role.',
      users: 0,
      permissions: { ...blank, Dashboard: { view: true, create: false, edit: false, delete: false } },
    }
    setRoles((prev) => [...prev, role])
    setSelectedId(role.id)
    setOpen(false)
    setNewRole({ name: '', description: '' })
  }

  return (
    <AppShell
      title="User Roles"
      subtitle="Define roles and control module-level permissions."
      metrics={[]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Roles list */}
        <SectionCard className="lg:col-span-1">
          <SectionHeader
            title="Roles"
            description={`${roles.length} defined`}
            actions={
              <Button size="sm" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                New
              </Button>
            }
          />
          <ul className="flex flex-col p-2">
            {roles.map((r) => {
              const isActive = r.id === selected.id
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(r.id)
                      setDirty(false)
                    }}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors',
                      isActive ? 'bg-accent' : 'hover:bg-muted/50',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{r.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{r.users}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {r.description}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </SectionCard>

        {/* Permission matrix */}
        <SectionCard className="lg:col-span-2">
          <SectionHeader
            title={selected.name}
            description={selected.description}
            actions={
              <div className="flex items-center gap-3">
                <StatusBadge tone="green" dot={false}>
                  {grantedCount} permissions
                </StatusBadge>
                <Button disabled={!dirty} onClick={() => setDirty(false)}>
                  <Check className="h-4 w-4" />
                  Save changes
                </Button>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Module</th>
                  {ACTIONS.map((a) => (
                    <th key={a} className="px-3 py-3 text-center font-medium">
                      {ACTION_LABEL[a]}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-center font-medium">All</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_MODULES.map((m) => {
                  const all = ACTIONS.every((a) => selected.permissions[m][a])
                  return (
                    <tr key={m} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium text-foreground">{m}</td>
                      {ACTIONS.map((a) => (
                        <td key={a} className="px-3 py-3 text-center">
                          <label className="inline-flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={selected.permissions[m][a]}
                              onChange={() => togglePermission(m, a)}
                            />
                            <span
                              className={cn(
                                'flex h-5 w-5 items-center justify-center rounded-md border transition-colors',
                                selected.permissions[m][a]
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-background text-transparent',
                              )}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          </label>
                        </td>
                      ))}
                      <td className="px-5 py-3">
                        <div className="flex justify-center">
                          <Toggle
                            checked={all}
                            onChange={(v) => toggleModuleAll(m, v)}
                            label={`Toggle all permissions for ${m}`}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create role"
        description="Add a new role, then assign its permissions."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addRole}>Create role</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Role name">
            <TextInput
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="e.g. Planning Officer"
            />
          </Field>
          <Field label="Description">
            <TextInput
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="What this role is responsible for"
            />
          </Field>
        </div>
      </Modal>
    </AppShell>
  )
}
