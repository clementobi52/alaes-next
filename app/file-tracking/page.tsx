import { Suspense } from 'react'
import { AppShell } from '@/components/app-shell'
import { FileTrackingWorkspace } from '@/components/file-tracking/file-tracking-workspace'

export const metadata = { title: 'File Tracking | ALAES', description: 'Track, locate, and log official files across departments.' }

export default function FileTrackingPage() {
  return (
    <AppShell title="File Tracking" subtitle="Monitor, locate, and manage official file movements across departments.">
      <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading file tracker...</div>}>
        <FileTrackingWorkspace />
      </Suspense>
    </AppShell>
  )
}
