'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  SEED_ORGANIZATIONS,
  type AccessRole,
  type ActivityEntry,
  type InstitutionType,
  type Organization,
  type OrgSettings,
  type OrgUser,
  type UserType,
} from '@/lib/phs-portal-data'

export type PortalView = 'landing' | 'signin' | 'register' | 'dashboard' | 'organization'

type Session = { orgId: string }

type NewUserInput = {
  name: string
  email: string
  jobTitle: string
  department: string
  userType: UserType
  accessRole: AccessRole
  tokens: number
}

type RegisterInput = {
  name: string
  type: InstitutionType
  email: string
  phone: string
  password: string
}

type PortalContextValue = {
  view: PortalView
  setView: (view: PortalView) => void
  organizations: Record<string, Organization>
  currentOrg: Organization | null
  signIn: (institutionName: string, password: string) => { ok: boolean; error?: string }
  register: (input: RegisterInput) => { ok: boolean; error?: string }
  logout: () => void
  addTokens: (amount: number, label: string) => void
  consumeToken: () => boolean
  addUser: (input: NewUserInput) => void
  toggleUserStatus: (userId: number) => void
  updateBranding: (settings: Partial<OrgSettings>) => void
  logActivity: (entry: Omit<ActivityEntry, 'timestamp'>) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

/** Clone the seed data so demo mutations never leak across sessions. */
function seed(): Record<string, Organization> {
  return JSON.parse(JSON.stringify(SEED_ORGANIZATIONS))
}

function timestamp() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || `org_${Date.now()}`
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Record<string, Organization>>(seed)
  const [session, setSession] = useState<Session | null>(null)
  const [view, setView] = useState<PortalView>('landing')

  const currentOrg = session ? organizations[session.orgId] ?? null : null

  const logActivity = useCallback(
    (entry: Omit<ActivityEntry, 'timestamp'>) => {
      setSession((current) => {
        if (!current) return current
        setOrganizations((prev) => {
          const org = prev[current.orgId]
          if (!org) return prev
          return {
            ...prev,
            [current.orgId]: { ...org, activityLog: [{ ...entry, timestamp: timestamp() }, ...org.activityLog] },
          }
        })
        return current
      })
    },
    [],
  )

  const signIn = useCallback<PortalContextValue['signIn']>(
    (institutionName, password) => {
      const match = Object.values(organizations).find(
        (org) => org.name.toLowerCase() === institutionName.trim().toLowerCase(),
      )
      if (!match) return { ok: false, error: 'No institution found with that name.' }
      if (match.password !== password) return { ok: false, error: 'Incorrect password. Try demo123 for demo accounts.' }
      setSession({ orgId: match.id })
      setView('dashboard')
      return { ok: true }
    },
    [organizations],
  )

  const register = useCallback<PortalContextValue['register']>(
    (input) => {
      const id = slugify(input.name)
      if (organizations[id]) return { ok: false, error: 'An institution with that name is already registered.' }
      const org: Organization = {
        id,
        name: input.name.trim(),
        type: input.type,
        password: input.password,
        tokens: 100,
        settings: {
          name: input.name.trim(),
          primaryColor: '#0b5c3f',
          secondaryColor: '#d4af37',
          logoUrl: null,
          bannerUrl: null,
        },
        users: [
          {
            id: 1,
            name: 'Primary Administrator',
            email: input.email.trim(),
            jobTitle: 'Account Owner',
            department: 'Administration',
            userType: 'super_admin',
            accessRole: 'search_only',
            tokensUsed: 0,
            status: 'active',
            joinedDate: new Date().toISOString().slice(0, 10),
          },
        ],
        activityLog: [{ action: 'Organization registered', user: input.email.trim(), timestamp: timestamp(), type: 'user' }],
      }
      setOrganizations((prev) => ({ ...prev, [id]: org }))
      setSession({ orgId: id })
      setView('dashboard')
      return { ok: true }
    },
    [organizations],
  )

  const logout = useCallback(() => {
    setSession(null)
    setView('landing')
  }, [])

  const addTokens = useCallback(
    (amount: number, label: string) => {
      setSession((current) => {
        if (!current) return current
        setOrganizations((prev) => {
          const org = prev[current.orgId]
          if (!org) return prev
          return {
            ...prev,
            [current.orgId]: {
              ...org,
              tokens: org.tokens + amount,
              activityLog: [{ action: label, user: 'Billing', timestamp: timestamp(), type: 'billing' }, ...org.activityLog],
            },
          }
        })
        return current
      })
    },
    [],
  )

  const consumeToken = useCallback(() => {
    if (!session) return false
    const org = organizations[session.orgId]
    if (!org || org.tokens < 1) return false
    setOrganizations((prev) => {
      const target = prev[session.orgId]
      if (!target) return prev
      return { ...prev, [session.orgId]: { ...target, tokens: target.tokens - 1 } }
    })
    return true
  }, [session, organizations])

  const addUser = useCallback<PortalContextValue['addUser']>(
    (input) => {
      setSession((current) => {
        if (!current) return current
        setOrganizations((prev) => {
          const org = prev[current.orgId]
          if (!org) return prev
          const nextId = Math.max(0, ...org.users.map((u) => u.id)) + 1
          const newUser: OrgUser = {
            id: nextId,
            name: input.name,
            email: input.email,
            jobTitle: input.jobTitle,
            department: input.department || '—',
            userType: input.userType,
            accessRole: input.accessRole,
            tokensUsed: 0,
            status: 'active',
            joinedDate: new Date().toISOString().slice(0, 10),
          }
          return {
            ...prev,
            [current.orgId]: {
              ...org,
              users: [...org.users, newUser],
              tokens: Math.max(0, org.tokens - input.tokens),
              activityLog: [{ action: `Team member added: ${input.name}`, user: input.email, timestamp: timestamp(), type: 'user' }, ...org.activityLog],
            },
          }
        })
        return current
      })
    },
    [],
  )

  const toggleUserStatus = useCallback((userId: number) => {
    setSession((current) => {
      if (!current) return current
      setOrganizations((prev) => {
        const org = prev[current.orgId]
        if (!org) return prev
        return {
          ...prev,
          [current.orgId]: {
            ...org,
            users: org.users.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)),
          },
        }
      })
      return current
    })
  }, [])

  const updateBranding = useCallback<PortalContextValue['updateBranding']>((settings) => {
    setSession((current) => {
      if (!current) return current
      setOrganizations((prev) => {
        const org = prev[current.orgId]
        if (!org) return prev
        return {
          ...prev,
          [current.orgId]: {
            ...org,
            settings: { ...org.settings, ...settings },
            activityLog: [{ action: 'Branding updated', user: 'System', timestamp: timestamp(), type: 'settings' }, ...org.activityLog],
          },
        }
      })
      return current
    })
  }, [])

  const value = useMemo<PortalContextValue>(
    () => ({
      view,
      setView,
      organizations,
      currentOrg,
      signIn,
      register,
      logout,
      addTokens,
      consumeToken,
      addUser,
      toggleUserStatus,
      updateBranding,
      logActivity,
    }),
    [view, organizations, currentOrg, signIn, register, logout, addTokens, consumeToken, addUser, toggleUserStatus, updateBranding, logActivity],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within a PortalProvider')
  return ctx
}
