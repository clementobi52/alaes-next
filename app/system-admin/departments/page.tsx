'use client'

import { useMemo, useState } from 'react'
import { Building2, Plus, Users, Trash2, Pencil } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  Field,
  Modal,
  SearchBar,
  SectionCard,
  StatTile,
  TextInput,
} from '@/components/system-admin/primitives'
import { DEPARTMENTS, USERS, type Department } from '@/lib/system-admin-data'

const HEADS = Array.from(new Set(USERS.map((u) => u.name)))

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', code: '', head: HEADS[0], description: '' })

  const filtered = useMemo(
    () =>
      departments.filter((d) => {
        const q = query.toLowerCase()
        return !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.head.toLowerCase().includes(q)
      }),
    [departments, query],
  )

  const totalMembers = departments.reduce((a, d) => a + d.members, 0)

  function openCreate() {
    setEditing(null)
    setForm({ name: '', code: '', head: HEADS[0], description: '' })
    setOpen(true)
  }

  function openEdit(d: Department) {
    setEditing(d)
    setForm({ name: d.name, code: d.code, head: d.head, description: d.description })
    setOpen(true)
  }

  function save() {
    if (!form.name.trim() || !form.code.trim()) return
    if (editing) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...form, code: form.code.toUpperCase() } : d)),
      )
    } else {
      setDepartments((prev) => [
        ...prev,
        {
          id: `d${Date.now()}`,
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          head: form.head,
          members: 0,
          description: form.description.trim() || 'New department.',
        },
      ])
    }
    setOpen(false)
  }

  function remove(id: string) {
    setDepartments((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <AppShell
      title="Departments"
      subtitle="Organise ALAES units, their heads and staffing."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          <StatTile icon={Building2} label="Departments" value={departments.length} tone="blue" />
          <StatTile icon={Users} label="Total staff" value={totalMembers} tone="green" />
          <StatTile
            icon={Users}
            label="Avg. per department"
            value={departments.length ? Math.round(totalMembers / departments.length) : 0}
            tone="violet"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search departments…"
            className="sm:max-w-sm sm:flex-1"
          />
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add department
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
            <SectionCard key={d.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                  {d.code}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${d.name}`}
                    onClick={() => openEdit(d)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${d.name}`}
                    onClick={() => remove(d.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-balance">{d.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground text-pretty">{d.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Avatar name={d.head} className="h-8 w-8" />
                  <div className="leading-tight">
                    <p className="text-xs text-muted-foreground">Head</p>
                    <p className="text-sm font-medium text-foreground">{d.head}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {d.members}
                </span>
              </div>
            </SectionCard>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit department' : 'Add department'}
        description={editing ? 'Update this department’s details.' : 'Create a new ALAES department.'}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? 'Save changes' : 'Create department'}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
            <Field label="Department name">
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Planning & Recommendation"
              />
            </Field>
            <Field label="Code">
              <TextInput
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="PR"
                maxLength={4}
              />
            </Field>
          </div>
          <Field label="Department head">
            <select
              value={form.head}
              onChange={(e) => setForm({ ...form, head: e.target.value })}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            >
              {HEADS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <TextInput
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What this department handles"
            />
          </Field>
        </div>
      </Modal>
    </AppShell>
  )
}
