'use client'

import { useEffect, useState } from 'react'
import { PhsRegister, PhsSignIn } from '@/components/phs/phs-auth'
import { PhsDashboard } from '@/components/phs/phs-dashboard'
import { PhsLanding } from '@/components/phs/phs-landing'
import { PhsOrganization } from '@/components/phs/phs-organization'
import { PortalProvider, usePortal } from '@/components/phs/phs-store'

type PortalView = 'landing' | 'signin' | 'register' | 'dashboard' | 'organization'

function PortalContent() {
  const { currentOrg: sessionOrg, view, setView } = usePortal()
  const session = Boolean(sessionOrg)
  const [localView, setLocalView] = useState<PortalView>(view as PortalView)
  const activeView = localView

  useEffect(() => {
    if (!session && (activeView === 'dashboard' || activeView === 'organization')) setLocalView('signin')
    if (session && (activeView === 'signin' || activeView === 'register')) setLocalView('dashboard')
  }, [session, activeView])

  useEffect(() => {
    setView(activeView)
  }, [activeView, setView])

  if (activeView === 'landing') return <PhsLanding />
  if (activeView === 'signin') return <PhsSignIn />
  if (activeView === 'register') return <PhsRegister />
  if (activeView === 'organization') return <PhsOrganization />
  return <PhsDashboard />
}

export default function PHSPage() {
  return <PortalProvider><PortalContent /></PortalProvider>
}
