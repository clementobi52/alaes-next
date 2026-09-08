'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Crown,
  Palette,
  Plus,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react'
import { type AccessRole, type UserType } from '@/lib/phs-portal-data'
import { usePortal } from '@/components/phs/phs-store'

type Tab = 'members' | 'branding' | 'activity'

const ROLE_LABELS: Record<AccessRole, string> = {
  search_only: 'Search Only',
  report_viewer: 'Report Viewer',
  analytics_viewer: 'Analytics Viewer',
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'

function AddMemberModal({ onClose }: { onClose: () => void }) {
  const { addUser } = usePortal()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [userType, setUserType] = useState<UserType>('regular_user')
  const [accessRole, setAccessRole] = useState<AccessRole>('search_only')
  const [tokens, setTokens] = useState(250)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !jobTitle.trim()) return
    addUser({ name, email, jobTitle, department, userType, accessRole, tokens })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Add New Team Member</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="m-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
              <input id="m-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="m-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email Address *</label>
              <input id="m-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="jane@org.com" />
            </div>
            <div>
              <label htmlFor="m-title" className="mb-1.5 block text-sm font-medium text-slate-700">Job Title *</label>
              <input id="m-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputClass} placeholder="Legal Officer" />
            </div>
            <div>
              <label htmlFor="m-dept" className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
              <input id="m-dept" value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass} placeholder="Legal" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">User Type</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {([['super_admin', 'Super Administrator', 'Full access & management', Crown], ['regular_user', 'Regular User', 'Limited, personal access', User]] as const).map(([value, title, desc, Icon]) => (
                <button key={value} type="button" onClick={() => setUserType(value)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${userType === value ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <Icon className={`h-6 w-6 ${userType === value ? 'text-violet-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Access Role</h3>
            <div className="space-y-2">
              {(Object.keys(ROLE_LABELS) as AccessRole[]).map((role) => (
                <label key={role} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50">
                  <input type="radio" name="access-role" checked={accessRole === role} onChange={() => setAccessRole(role)} className="text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm font-medium">{ROLE_LABELS[role]}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="m-tokens" className="mb-1.5 block text-sm font-medium text-slate-700">Initial Token Allocation</label>
            <input id="m-tokens" type="number" min={0} value={tokens} onChange={(e) => setTokens(Number(e.target.value))} className={inputClass} />
            <p className="mt-1.5 text-xs text-slate-500">Tokens are deducted from your organization balance.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm hover:bg-slate-100">Cancel</button>
          <button type="submit" className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Create Member</button>
        </div>
      </form>
    </div>
  )
}

export function PhsOrganization() {
  const { currentOrg, setView, updateBranding, toggleUserStatus } = usePortal()
  const [tab, setTab] = useState<Tab>('members')
  const [addOpen, setAddOpen] = useState(false)
  const [draftName, setDraftName] = useState(currentOrg?.settings.name ?? '')
  const [draftPrimary, setDraftPrimary] = useState(currentOrg?.settings.primaryColor ?? '#0b5c3f')
  const [draftSecondary, setDraftSecondary] = useState(currentOrg?.settings.secondaryColor ?? '#d4af37')
  const [saved, setSaved] = useState(false)

  if (!currentOrg) return null
  const { users, activityLog, tokens, settings } = currentOrg

  const saveBranding = () => {
    updateBranding({ name: draftName, primaryColor: draftPrimary, secondaryColor: draftSecondary })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'activity', label: 'Activity Log', icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` }}>
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Organization Settings</h1>
              <p className="text-xs text-slate-500">{settings.name}</p>
            </div>
          </div>
          <button type="button" onClick={() => setView('dashboard')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Team Members', value: users.length },
            { label: 'Active Users', value: users.filter((u) => u.status === 'active').length },
            { label: 'Token Balance', value: tokens.toLocaleString() },
            { label: 'Tokens Used', value: users.reduce((sum, u) => sum + u.tokensUsed, 0).toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {tabs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${tab === item.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </div>

        {tab === 'members' && (
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <button type="button" onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                <Plus className="h-4 w-4" /> Add Member
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Access</th>
                    <th className="px-5 py-3">Tokens Used</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <p className="text-xs text-slate-400">{user.jobTitle} · {user.department}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${user.userType === 'super_admin' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.userType === 'super_admin' ? <Crown className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {user.userType === 'super_admin' ? 'Super Admin' : 'Regular'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{ROLE_LABELS[user.accessRole]}</td>
                      <td className="px-5 py-4 font-medium">{user.tokensUsed}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{user.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" onClick={() => toggleUserStatus(user.id)} className="text-xs font-medium text-slate-500 hover:text-slate-900">
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'branding' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Brand Settings</h2>
              <p className="mt-1 text-sm text-slate-500">Customize how your team sees the portal.</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="b-name" className="mb-1.5 block text-sm font-medium text-slate-700">Organization Name</label>
                  <input id="b-name" value={draftName} onChange={(e) => setDraftName(e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b-primary" className="mb-1.5 block text-sm font-medium text-slate-700">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input id="b-primary" type="color" value={draftPrimary} onChange={(e) => setDraftPrimary(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300" />
                      <input value={draftPrimary} onChange={(e) => setDraftPrimary(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="b-secondary" className="mb-1.5 block text-sm font-medium text-slate-700">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input id="b-secondary" type="color" value={draftSecondary} onChange={(e) => setDraftSecondary(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300" />
                      <input value={draftSecondary} onChange={(e) => setDraftSecondary(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={saveBranding} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Save Branding Changes</button>
                  {saved && <span className="text-sm font-medium text-emerald-600">Saved!</span>}
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">How your team sees it</span>
              </div>
              <div className="rounded-2xl bg-white p-5 text-slate-900">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${draftPrimary}, ${draftSecondary})` }}>
                    <Users className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xl font-semibold">{draftName || 'Your Organization'}</p>
                    <p className="text-sm text-slate-500">Legal Intelligence Platform</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="mb-2 text-xs text-slate-400">PRIMARY BUTTON</p>
                  <button type="button" className="w-full rounded-2xl py-3 font-medium text-white" style={{ backgroundColor: draftPrimary }}>Continue to Search</button>
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-400">SECONDARY BUTTON</p>
                  <button type="button" className="w-full rounded-2xl border-2 py-3 font-medium" style={{ borderColor: draftPrimary, color: draftPrimary }}>View Reports</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold">Activity Log</h2>
              <p className="mt-0.5 text-sm text-slate-500">Recent actions across your organization.</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {activityLog.map((entry, i) => (
                <li key={`${entry.timestamp}-${i}`} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${entry.type === 'billing' ? 'bg-amber-100 text-amber-700' : entry.type === 'settings' ? 'bg-blue-100 text-blue-700' : entry.type === 'search' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                      {entry.type.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-slate-500">{entry.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{entry.timestamp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {addOpen && <AddMemberModal onClose={() => setAddOpen(false)} />}
    </div>
  )
}
