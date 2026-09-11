import { AppShell } from '@/components/app-shell'
import { FileDigitalLibrary } from '@/components/docware/file-digital-library'

export const metadata = {
  title: 'File Digital Library - Doc-WARE | ALAES',
  description: 'Search and manage digitally archived files in the ALAES Doc-WARE library.',
}

export default function DigitalFileArchivePage() {
  return (
    <AppShell title="File Digital Library - Doc-WARE" subtitle="Access and manage digitally archived files.">
      <FileDigitalLibrary />
    </AppShell>
  )
}
