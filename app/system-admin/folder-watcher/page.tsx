'use client'

import { useMemo, useState } from 'react'
import { FolderSync, FolderCog, Files, Pause, Play, Plus, Trash2, RefreshCw } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  Field,
  Modal,
  SectionCard,
  SectionHeader,
  StatTile,
  StatusBadge,
  TextInput,
  Toggle,
} from '@/components/system-admin/primitives'
import { FOLDER_WATCHERS, type FolderWatcher } from '@/lib/system-admin-data'

export default function FolderWatcherPage() {
  const [watchers, setWatchers] = useState<FolderWatcher[]>(FOLDER_WATCHERS)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', path: '', intervalSec: 60, autoIndex: true })

  const stats = useMemo(
    () => ({
      total: watchers.length,
      watching: watchers.filter((w) => w.status === 'watching').length,
      files: watchers.reduce((a, w) => a + w.files, 0),
    }),
    [watchers],
  )

  function toggleStatus(id: string) {
    setWatchers((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === 'watching' ? 'paused' : 'watching', lastScan: 'Just now' }
          : w,
      ),
    )
  }

  function scanNow(id: string) {
    setWatchers((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, lastScan: 'Just now', files: w.files + Math.floor(Math.random() * 12) }
          : w,
      ),
    )
  }

  function setAutoIndex(id: string, v: boolean) {
    setWatchers((prev) => prev.map((w) => (w.id === id ? { ...w, autoIndex: v } : w)))
  }

  function remove(id: string) {
    setWatchers((prev) => prev.filter((w) => w.id !== id))
  }

  function addWatcher() {
    if (!form.name.trim() || !form.path.trim()) return
    setWatchers((prev) => [
      ...prev,
      {
        id: `f${Date.now()}`,
        name: form.name.trim(),
        path: form.path.trim(),
        status: 'watching',
        files: 0,
        lastScan: 'Never',
        intervalSec: Number(form.intervalSec) || 60,
        autoIndex: form.autoIndex,
      },
    ])
    setOpen(false)
    setForm({ name: '', path: '', intervalSec: 60, autoIndex: true })
  }

  return (
    <AppShell
      title="Folder Watcher"
      subtitle="Monitor scan folders and auto-index incoming files."
      metrics={[]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          <StatTile icon={FolderCog} label="Configured watchers" value={stats.total} tone="blue" />
          <StatTile icon={FolderSync} label="Currently watching" value={stats.watching} tone="green" />
          <StatTile icon={Files} label="Files tracked" value={stats.files.toLocaleString()} tone="violet" />
        </div>

        <SectionCard>
          <SectionHeader
            title="Watched folders"
            description="Directories monitored for new documents"
            actions={
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Add watcher
              </Button>
            }
          />
          <ul className="flex flex-col">
            {watchers.map((w) => (
              <li
                key={w.id}
                className="flex flex-col gap-4 border-b border-border/60 p-5 last:border-0 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <FolderSync className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{w.name}</p>
                      <StatusBadge tone={w.status === 'watching' ? 'green' : 'neutral'}>
                        {w.status === 'watching' ? 'Watching' : 'Paused'}
                      </StatusBadge>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{w.path}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {w.files.toLocaleString()} files · every {w.intervalSec}s · last scan {w.lastScan}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Auto-index
                    <Toggle
                      checked={w.autoIndex}
                      onChange={(v) => setAutoIndex(w.id, v)}
                      label={`Auto-index for ${w.name}`}
                    />
                  </label>
                  <Button variant="outline" size="sm" onClick={() => scanNow(w.id)}>
                    <RefreshCw className="h-4 w-4" />
                    Scan
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(w.id)}>
                    {w.status === 'watching' ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    )}
                  </Button>
                  <button
                    type="button"
                    aria-label={`Delete ${w.name}`}
                    onClick={() => remove(w.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
            {watchers.length === 0 && (
              <li className="px-5 py-12 text-center text-muted-foreground">
                No folder watchers configured.
              </li>
            )}
          </ul>
        </SectionCard>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add folder watcher"
        description="Monitor a directory and optionally auto-index new files."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addWatcher}>Add watcher</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Watcher name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Recertification Scans"
            />
          </Field>
          <Field label="Folder path">
            <TextInput
              value={form.path}
              onChange={(e) => setForm({ ...form, path: e.target.value })}
              placeholder="/mnt/alaes/scans/…"
            />
          </Field>
          <Field label="Scan interval (seconds)">
            <TextInput
              type="number"
              value={form.intervalSec}
              onChange={(e) => setForm({ ...form, intervalSec: Number(e.target.value) })}
            />
          </Field>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-index new files</p>
              <p className="text-xs text-muted-foreground">Send discovered files straight to DMS indexing.</p>
            </div>
            <Toggle
              checked={form.autoIndex}
              onChange={(v) => setForm({ ...form, autoIndex: v })}
              label="Auto-index new files"
            />
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
