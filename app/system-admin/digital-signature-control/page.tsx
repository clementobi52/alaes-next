'use client'

import { useMemo, useState } from 'react'
import { PenTool, ShieldCheck, Clock, Ban, Check, X, UserPlus } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  Field,
  Modal,
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
  DEPARTMENTS,
  SIGNATORIES,
  type Signatory,
  type SignatureStatus,
} from '@/lib/system-admin-data'

const STATUS_TONE: Record<SignatureStatus, Tone> = {
  enrolled: 'green',
  pending: 'amber',
  revoked: 'red',
}
const STATUS_LABEL: Record<SignatureStatus, string> = {
  enrolled: 'Enrolled',
  pending: 'Pending',
  revoked: 'Revoked',
}

export default function DigitalSignaturePage() {
  const [signatories, setSignatories] = useState<Signatory[]>(SIGNATORIES)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', department: DEPARTMENTS[0].name })

  const pending = signatories.filter((s) => s.status === 'pending')

  const stats = useMemo(
    () => ({
      enrolled: signatories.filter((s) => s.status === 'enrolled').length,
      active: signatories.filter((s) => s.enabled).length,
      pending: pending.length,
      revoked: signatories.filter((s) => s.status === 'revoked').length,
    }),
    [signatories, pending.length],
  )

  function setEnabled(id: string, enabled: boolean) {
    setSignatories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s)),
    )
  }

  function decide(id: string, approve: boolean) {
    setSignatories((prev) =>
      prev.map((s) =>
        s.id === id
          ? approve
            ? { ...s, status: 'enrolled', enabled: true, lastUsed: 'Just enrolled', expires: 'Dec 31, 2026' }
            : { ...s, status: 'revoked', enabled: false, expires: 'Rejected' }
          : s,
      ),
    )
  }

  function revoke(id: string) {
    setSignatories((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'revoked', enabled: false, expires: 'Revoked' } : s,
      ),
    )
  }

  function enroll() {
    if (!form.name.trim() || !form.role.trim()) return
    setSignatories((prev) => [
      {
        id: `g${Date.now()}`,
        name: form.name.trim(),
        role: form.role.trim(),
        department: form.department,
        status: 'pending',
        enabled: false,
        lastUsed: 'Never',
        expires: '—',
      },
      ...prev,
    ])
    setOpen(false)
    setForm({ name: '', role: '', department: DEPARTMENTS[0].name })
  }

  return (
    <AppShell
      title="Digital Signature Control"
      subtitle="Enrol signatories and govern digital signing across ALAES."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatTile icon={ShieldCheck} label="Enrolled" value={stats.enrolled} tone="green" />
          <StatTile icon={PenTool} label="Signing enabled" value={stats.active} tone="blue" />
          <StatTile icon={Clock} label="Pending requests" value={stats.pending} tone="amber" />
          <StatTile icon={Ban} label="Revoked" value={stats.revoked} tone="red" />
        </div>

        {pending.length > 0 && (
          <SectionCard>
            <SectionHeader
              title="Pending enrollment requests"
              description="Approve to issue a signing certificate, or reject the request."
            />
            <ul className="flex flex-col">
              {pending.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 border-b border-border/60 p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.role} · {s.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => decide(s.id, false)}>
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => decide(s.id, true)}>
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        <SectionCard>
          <SectionHeader
            title="Signatories"
            description={`${signatories.length} registered`}
            actions={
              <Button onClick={() => setOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Enrol signatory
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Signatory</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Certificate expires</th>
                  <th className="px-5 py-3 font-medium">Last used</th>
                  <th className="px-5 py-3 font-medium">Signing</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {signatories.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{s.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {s.role} · {s.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={STATUS_TONE[s.status]}>
                        {STATUS_LABEL[s.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{s.expires}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.lastUsed}</td>
                    <td className="px-5 py-3">
                      <Toggle
                        checked={s.enabled}
                        disabled={s.status !== 'enrolled'}
                        onChange={(v) => setEnabled(s.id, v)}
                        label={`Toggle signing for ${s.name}`}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {s.status !== 'revoked' && (
                        <button
                          type="button"
                          onClick={() => revoke(s.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Enrol signatory"
        description="Submit a signatory for digital certificate enrollment."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={enroll}>Submit request</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Full name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Barr. Chidi Eze"
            />
          </Field>
          <Field label="Role / title">
            <TextInput
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Director of Lands"
            />
          </Field>
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
        </div>
      </Modal>
    </AppShell>
  )
}
