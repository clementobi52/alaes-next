'use client'

import { useState } from 'react'
import { Check, Save } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Field,
  SectionCard,
  SectionHeader,
  SelectInput,
  Tabs,
  TextInput,
  Toggle,
} from '@/components/system-admin/primitives'
import { DEFAULT_SETTINGS, type SystemSettings } from '@/lib/system-admin-data'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'backup', label: 'Backup' },
]

export default function SystemSettingsPage() {
  const [tab, setTab] = useState('general')
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS)
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
    setSaved(false)
  }

  function save() {
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AppShell
      title="System Settings"
      subtitle="Configure organisation, security, notifications and backups."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-chart-1">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <Button disabled={!dirty} onClick={save}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </div>

        {tab === 'general' && (
          <SectionCard>
            <SectionHeader title="Organisation" description="Identity shown across the registry." />
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <Field label="Organisation name">
                <TextInput value={settings.orgName} onChange={(e) => set('orgName', e.target.value)} />
              </Field>
              <Field label="Registry zone">
                <TextInput value={settings.registryZone} onChange={(e) => set('registryZone', e.target.value)} />
              </Field>
              <Field label="Support email">
                <TextInput
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => set('supportEmail', e.target.value)}
                />
              </Field>
              <Field label="Timezone">
                <SelectInput value={settings.timezone} onChange={(e) => set('timezone', e.target.value)}>
                  <option>(GMT+01:00) West Africa Time — Lagos</option>
                  <option>(GMT+00:00) Greenwich Mean Time</option>
                  <option>(GMT+02:00) Central Africa Time</option>
                </SelectInput>
              </Field>
              <Field label="Currency">
                <SelectInput value={settings.currency} onChange={(e) => set('currency', e.target.value)}>
                  <option>NGN — Nigerian Naira</option>
                  <option>USD — US Dollar</option>
                </SelectInput>
              </Field>
              <Field label="Date format">
                <SelectInput value={settings.dateFormat} onChange={(e) => set('dateFormat', e.target.value)}>
                  <option>DD MMM, YYYY</option>
                  <option>YYYY-MM-DD</option>
                  <option>MM/DD/YYYY</option>
                </SelectInput>
              </Field>
            </div>
            <div className="border-t border-border p-5">
              <ToggleRow
                title="Maintenance mode"
                description="Temporarily block non-admin access while you work on the system."
                checked={settings.maintenanceMode}
                onChange={(v) => set('maintenanceMode', v)}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'security' && (
          <SectionCard>
            <SectionHeader title="Security & access" description="Protect accounts and control access." />
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <Field label="Session timeout (minutes)" hint="Auto sign-out after inactivity.">
                <TextInput
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => set('sessionTimeout', Number(e.target.value))}
                />
              </Field>
              <Field label="Password expiry (days)">
                <TextInput
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => set('passwordExpiryDays', Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="flex flex-col gap-4 border-t border-border p-5">
              <ToggleRow
                title="Enforce two-factor authentication"
                description="Require a second factor for every staff sign-in."
                checked={settings.enforce2fa}
                onChange={(v) => set('enforce2fa', v)}
              />
              <ToggleRow
                title="IP allowlist"
                description="Only permit access from approved registry networks."
                checked={settings.ipAllowlist}
                onChange={(v) => set('ipAllowlist', v)}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'notifications' && (
          <SectionCard>
            <SectionHeader title="Notifications" description="How ALAES alerts staff and admins." />
            <div className="flex flex-col gap-4 p-5">
              <ToggleRow
                title="Email notifications"
                description="Send transaction and approval updates by email."
                checked={settings.emailNotifications}
                onChange={(v) => set('emailNotifications', v)}
              />
              <ToggleRow
                title="SMS alerts"
                description="Send critical alerts to registered phone numbers."
                checked={settings.smsAlerts}
                onChange={(v) => set('smsAlerts', v)}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'backup' && (
          <SectionCard>
            <SectionHeader title="Backup & retention" description="Data protection and audit retention." />
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <Field label="Audit log retention (days)">
                <TextInput
                  type="number"
                  value={settings.auditRetentionDays}
                  onChange={(e) => set('auditRetentionDays', Number(e.target.value))}
                />
              </Field>
              <Field label="Backup frequency">
                <SelectInput
                  value={settings.backupFrequency}
                  onChange={(e) => set('backupFrequency', e.target.value)}
                >
                  <option>Hourly</option>
                  <option>Daily at 02:00</option>
                  <option>Weekly (Sunday)</option>
                </SelectInput>
              </Field>
            </div>
            <div className="border-t border-border p-5">
              <ToggleRow
                title="Automatic backups"
                description="Run scheduled backups of the registry database and archive."
                checked={settings.autoBackup}
                onChange={(v) => set('autoBackup', v)}
              />
            </div>
          </SectionCard>
        )}
      </div>
    </AppShell>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}
