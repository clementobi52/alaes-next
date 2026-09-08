export type FileStatus = 'In Transit' | 'Received' | 'Pending' | 'Archived'

export type FileMovement = {
  id: string
  office: string
  action: string
  officer: string
  date: string
  time: string
  notes?: string
}

export type TrackedFile = {
  id: string
  reference: string
  subject: string
  sourceOffice: string
  currentOffice: string
  receivingOfficer: string
  status: FileStatus
  priority: 'Normal' | 'Urgent'
  dateLogged: string
  dueDate: string
  movement: FileMovement[]
  notes?: string
}

export const offices = ['Registry & Records', 'Legal Department', 'Lands Administration', 'Survey Department', 'Office of the Permanent Secretary', 'Commissioner\'s Office']

export const initialTrackedFiles: TrackedFile[] = [
  { id: 'FT-2026-00124', reference: 'ABIA/LR/2026/00124', subject: 'Application for Certificate of Occupancy — Umuahia North', sourceOffice: 'Registry & Records', currentOffice: 'Legal Department', receivingOfficer: 'Barr. Chidinma Okafor', status: 'In Transit', priority: 'Urgent', dateLogged: '08 Sep 2026', dueDate: '10 Sep 2026', movement: [{ id: 'm1', office: 'Registry & Records', action: 'Logged and dispatched', officer: 'Ifeanyi Nwosu', date: '08 Sep 2026', time: '09:14' }, { id: 'm2', office: 'Legal Department', action: 'Received for legal review', officer: 'Barr. Chidinma Okafor', date: '08 Sep 2026', time: '10:02' }] },
  { id: 'FT-2026-00123', reference: 'ABIA/SD/2026/00088', subject: 'Survey plan verification — Plot 45, Aba', sourceOffice: 'Survey Department', currentOffice: 'Lands Administration', receivingOfficer: 'Engr. Kelechi Eze', status: 'Received', priority: 'Normal', dateLogged: '07 Sep 2026', dueDate: '12 Sep 2026', movement: [{ id: 'm3', office: 'Survey Department', action: 'File logged', officer: 'Ngozi Opara', date: '07 Sep 2026', time: '14:30' }, { id: 'm4', office: 'Lands Administration', action: 'Received', officer: 'Engr. Kelechi Eze', date: '08 Sep 2026', time: '08:41' }] },
  { id: 'FT-2026-00122', reference: 'ABIA/LA/2026/00317', subject: 'Land allocation approval — Arochukwu', sourceOffice: 'Lands Administration', currentOffice: 'Commissioner\'s Office', receivingOfficer: 'Mrs. Nnenna Iheme', status: 'Pending', priority: 'Urgent', dateLogged: '05 Sep 2026', dueDate: '09 Sep 2026', movement: [{ id: 'm5', office: 'Lands Administration', action: 'File logged', officer: 'Uche Mba', date: '05 Sep 2026', time: '11:08' }] },
  { id: 'FT-2026-00121', reference: 'ABIA/PS/2026/00042', subject: 'Request for certified property search', sourceOffice: 'Legal Department', currentOffice: 'Registry & Records', receivingOfficer: 'Ifeanyi Nwosu', status: 'Archived', priority: 'Normal', dateLogged: '03 Sep 2026', dueDate: '06 Sep 2026', movement: [{ id: 'm6', office: 'Legal Department', action: 'File logged', officer: 'Barr. Adaobi Nnamani', date: '03 Sep 2026', time: '09:10' }, { id: 'm7', office: 'Registry & Records', action: 'Archived after completion', officer: 'Ifeanyi Nwosu', date: '06 Sep 2026', time: '16:20' }] },
]

export function getStatusTone(status: FileStatus) { return status === 'Received' ? 'green' : status === 'In Transit' ? 'blue' : status === 'Pending' ? 'amber' : 'slate' }

export function formatToday() { return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()) }

export function createFile(input: Pick<TrackedFile, 'reference' | 'subject' | 'sourceOffice' | 'currentOffice' | 'receivingOfficer' | 'priority' | 'dueDate' | 'notes'>): TrackedFile {
  const id = `FT-2026-${String(initialTrackedFiles.length + Math.floor(Math.random() * 60) + 1).padStart(5, '0')}`
  const now = new Date()
  return { ...input, id, status: 'In Transit', dateLogged: formatToday(), movement: [{ id: crypto.randomUUID(), office: input.sourceOffice, action: 'File logged and dispatched', officer: 'Current user', date: formatToday(), time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }
}
