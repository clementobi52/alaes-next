'use client'

import { useEffect } from 'react'
import { PhsRegister, PhsSignIn } from '@/components/phs/phs-auth'
import { PhsDashboard } from '@/components/phs/phs-dashboard'
import { PhsLanding } from '@/components/phs/phs-landing'
import { PhsOrganization } from '@/components/phs/phs-organization'
import { PortalProvider, usePortal } from '@/components/phs/phs-store'

type PortalView = 'landing' | 'signin' | 'register' | 'dashboard' | 'organization'

function PortalContent() {
  const { currentOrg: sessionOrg, view, setView } = usePortal()
  const session = Boolean(sessionOrg)
  const activeView = view as PortalView

  useEffect(() => {
    if (!session && (activeView === 'dashboard' || activeView === 'organization')) setView('signin')
    if (session && (activeView === 'signin' || activeView === 'register')) setView('dashboard')
  }, [session, activeView, setView])

  if (activeView === 'landing') return <PhsLanding />
  if (activeView === 'signin') return <PhsSignIn />
  if (activeView === 'register') return <PhsRegister />
  if (activeView === 'organization') return <PhsOrganization />
  return <PhsDashboard />
}

export default function PHSPage() {
  return <PortalProvider><PortalContent /></PortalProvider>
}
