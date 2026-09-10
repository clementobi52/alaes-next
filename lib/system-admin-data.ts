/**
 * Mock data + types for the ALAES System Admin module.
 * All screens read their seed data from here and then manage it in local
 * component state (no backend yet).
 */

export type UserStatus = 'active' | 'suspended' | 'invited'

export type StaffUser = {
  id: string
  name: string
  email: string
  username: string
  passwordHash?: string
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
  department: string
  role: string
  status: UserStatus
  lastActive: string
  phoneNumber?: string
  userType?: string
  rank?: string
  actions?: Record<'create' | 'view' | 'update' | 'delete', boolean>
  roles?: string[]
  pcAccess?: boolean
  onLeave?: boolean
  leaveStart?: string
  leaveEnd?: string
  deputy?: string
  leaveReason?: string
  oooFrom?: string
  oooTo?: string
  passportName?: string
}

export type Department = {
  id: string
  name: string
  code: string
  head: string
  members: number
  description: string
}

/** Modules used across the role permission matrix. */
export const PERMISSION_MODULES = [
  'Dashboard',
  'Customer Relationship',
  'DMS',
  'Digital File Archive',
  'File Tracking',
  'Programmes',
  'Deeds',
  'Legal Search',
  'Land',
  'Sectional Titling',
  'ALAES REV-M',
  'System Admin',
] as const

export type PermissionModule = (typeof PERMISSION_MODULES)[number]
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'
export type PermissionSet = Record<PermissionModule, Record<PermissionAction, boolean>>

export type Role = {
  id: string
  name: string
  description: string
  users: number
  permissions: PermissionSet
}

export type LogStatus = 'success' | 'failed' | 'warning'
export type ActivityLog = {
  id: string
  time: string
  user: string
  action: string
  module: string
  ip: string
  status: LogStatus
}

export type LiveSession = {
  id: string
  user: string
  role: string
  module: string
  device: string
  ip: string
  minutes: number
  status: 'active' | 'idle'
}

export type SignatureStatus = 'enrolled' | 'pending' | 'revoked'
export type Signatory = {
  id: string
  name: string
  role: string
  department: string
  status: SignatureStatus
  enabled: boolean
  lastUsed: string
  expires: string
}

export type FolderWatcher = {
  id: string
  name: string
  path: string
  status: 'watching' | 'paused'
  files: number
  lastScan: string
  intervalSec: number
  autoIndex: boolean
}

/* ---------------------------------- seeds --------------------------------- */

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Land Registry', code: 'LR', head: 'Adaeze Okoro', members: 24, description: 'Plot allocation, registration and title custody.' },
  { id: 'd2', name: 'Deeds & Instruments', code: 'DI', head: 'Emeka Uche', members: 16, description: 'Instrument capture and deeds registration.' },
  { id: 'd3', name: 'Survey & GIS', code: 'SG', head: 'Uche Okonkwo', members: 12, description: 'Field survey, parcel mapping and base maps.' },
  { id: 'd4', name: 'Legal Search', code: 'LS', head: 'Ada Amaka', members: 9, description: 'Official and online legal search services.' },
  { id: 'd5', name: 'Revenue (REV-M)', code: 'RV', head: 'Ngozi Adaeze', members: 11, description: 'Billing, receipts and land use charge.' },
  { id: 'd6', name: 'ICT / System Admin', code: 'ICT', head: 'Chukwueze John', members: 7, description: 'System administration and digital archive.' },
]

export const USERS: StaffUser[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@alaes.com',
    username: 'admin',
    passwordHash: '$2y$12$qVwUwPwOCPDLt.zm2w7MZu8tjv3Foq4bYIlf7ZY4MDCUoefHU367.',
    emailVerifiedAt: null,
    createdAt: '2026-09-06 02:47:58.707',
    updatedAt: '2026-09-06 02:47:58.707',
    department: 'ICT / System Admin',
    role: 'System Administrator',
    status: 'active',
    lastActive: 'Online now',
  },
]

const fullPerm = (v: boolean) => ({ view: v, create: v, edit: v, delete: v })

function buildPerm(overrides: Partial<Record<PermissionModule, Partial<Record<PermissionAction, boolean>>>>, base = false): PermissionSet {
  const set = {} as PermissionSet
  for (const m of PERMISSION_MODULES) {
    set[m] = { ...fullPerm(base), ...(overrides[m] ?? {}) }
  }
  return set
}

export const ROLES: Role[] = [
  {
    id: 'r1',
    name: 'System Administrator',
    description: 'Full, unrestricted access to every module and setting.',
    users: 2,
    permissions: buildPerm({}, true),
  },
  {
    id: 'r2',
    name: 'Senior Land Registrar',
    description: 'Approves land transactions and manages registry records.',
    users: 5,
    permissions: buildPerm({
      Dashboard: fullPerm(true),
      Land: fullPerm(true),
      'Sectional Titling': fullPerm(true),
      Deeds: { view: true, create: true, edit: true },
      DMS: { view: true, edit: true },
      'Digital File Archive': { view: true },
      'File Tracking': { view: true, edit: true },
    }),
  },
  {
    id: 'r3',
    name: 'Deeds Officer',
    description: 'Captures and registers instruments and encumbrances.',
    users: 8,
    permissions: buildPerm({
      Dashboard: { view: true },
      Deeds: fullPerm(true),
      'Legal Search': { view: true },
      DMS: { view: true, create: true },
      'File Tracking': { view: true },
    }),
  },
  {
    id: 'r4',
    name: 'Revenue Officer',
    description: 'Generates bills and receipts under ALAES REV-M.',
    users: 6,
    permissions: buildPerm({
      Dashboard: { view: true },
      'ALAES REV-M': fullPerm(true),
      Land: { view: true },
    }),
  },
  {
    id: 'r5',
    name: 'Records Clerk',
    description: 'Indexes, scans and tracks physical file movement.',
    users: 14,
    permissions: buildPerm({
      Dashboard: { view: true },
      DMS: { view: true, create: true, edit: true },
      'Digital File Archive': { view: true, create: true },
      'File Tracking': { view: true, create: true, edit: true },
    }),
  },
]

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'l1', time: 'Sep 06, 2026 14:32', user: 'Chukwueze John', action: 'Updated system settings', module: 'System Admin', ip: '10.12.4.18', status: 'success' },
  { id: 'l2', time: 'Sep 06, 2026 14:20', user: 'Adaeze Okoro', action: "Approved RofO for LABA/157", module: 'Land', ip: '10.12.4.7', status: 'success' },
  { id: 'l3', time: 'Sep 06, 2026 13:58', user: 'Ngozi Adaeze', action: 'Failed login attempt', module: 'Authentication', ip: '197.210.44.9', status: 'failed' },
  { id: 'l4', time: 'Sep 06, 2026 13:41', user: 'Emeka Uche', action: 'Registered instrument LABA/138', module: 'Deeds', ip: '10.12.4.11', status: 'success' },
  { id: 'l5', time: 'Sep 06, 2026 13:15', user: 'Ada Amaka', action: 'Generated legal search report', module: 'Legal Search', ip: '10.12.4.22', status: 'success' },
  { id: 'l6', time: 'Sep 06, 2026 12:47', user: 'Uche Okonkwo', action: 'Bulk import exceeded quota', module: 'Survey & GIS', ip: '10.12.4.31', status: 'warning' },
  { id: 'l7', time: 'Sep 06, 2026 12:30', user: 'Chukwuemeka Obi', action: 'Indexed 42 files (Zone A)', module: 'DMS', ip: '10.12.4.14', status: 'success' },
  { id: 'l8', time: 'Sep 06, 2026 11:58', user: 'Chukwueze John', action: 'Created user account: Ifeoma Nwosu', module: 'System Admin', ip: '10.12.4.18', status: 'success' },
  { id: 'l9', time: 'Sep 06, 2026 11:22', user: 'System', action: 'Scheduled backup completed', module: 'System', ip: 'localhost', status: 'success' },
  { id: 'l10', time: 'Sep 06, 2026 10:49', user: 'Ngozi Adaeze', action: 'Voided receipt RCP/2291', module: 'ALAES REV-M', ip: '10.12.4.9', status: 'warning' },
  { id: 'l11', time: 'Sep 06, 2026 10:15', user: 'Ada Amaka', action: 'Exported search log (CSV)', module: 'Legal Search', ip: '10.12.4.22', status: 'success' },
  { id: 'l12', time: 'Sep 06, 2026 09:40', user: 'Unknown', action: 'Blocked SQL injection attempt', module: 'Security', ip: '45.146.164.2', status: 'failed' },
]

export const LIVE_SESSIONS: LiveSession[] = [
  { id: 's1', user: 'Chukwueze John', role: 'System Administrator', module: 'System Admin', device: 'Chrome · Windows', ip: '10.12.4.18', minutes: 128, status: 'active' },
  { id: 's2', user: 'Adaeze Okoro', role: 'Senior Land Registrar', module: 'Land', device: 'Edge · Windows', ip: '10.12.4.7', minutes: 54, status: 'active' },
  { id: 's3', user: 'Emeka Uche', role: 'Deeds Officer', module: 'Deeds', device: 'Chrome · macOS', ip: '10.12.4.11', minutes: 33, status: 'active' },
  { id: 's4', user: 'Ada Amaka', role: 'Legal Search Officer', module: 'Legal Search', device: 'Firefox · Ubuntu', ip: '10.12.4.22', minutes: 12, status: 'idle' },
  { id: 's5', user: 'Chukwuemeka Obi', role: 'Records Clerk', module: 'DMS', device: 'ALAES Mobile · Android', ip: '10.12.5.4', minutes: 7, status: 'active' },
]

export const SIGNATORIES: Signatory[] = [
  { id: 'g1', name: 'Adaeze Okoro', role: 'Senior Land Registrar', department: 'Land Registry', status: 'enrolled', enabled: true, lastUsed: 'Sep 06, 2026', expires: 'Dec 31, 2026' },
  { id: 'g2', name: 'Emeka Uche', role: 'Deeds Officer', department: 'Deeds & Instruments', status: 'enrolled', enabled: true, lastUsed: 'Sep 05, 2026', expires: 'Nov 15, 2026' },
  { id: 'g3', name: 'Barr. Chidi Eze', role: 'Director of Lands', department: "Director's Office", status: 'enrolled', enabled: false, lastUsed: 'Aug 28, 2026', expires: 'Oct 02, 2026' },
  { id: 'g4', name: 'Ngozi Adaeze', role: 'Revenue Officer', department: 'Revenue (REV-M)', status: 'pending', enabled: false, lastUsed: 'Never', expires: '—' },
  { id: 'g5', name: 'Uche Okonkwo', role: 'Survey Officer', department: 'Survey & GIS', status: 'revoked', enabled: false, lastUsed: 'Jul 19, 2026', expires: 'Expired' },
]

export const FOLDER_WATCHERS: FolderWatcher[] = [
  { id: 'f1', name: 'Blind Scanning Drop', path: '/mnt/alaes/scans/blind', status: 'watching', files: 1284, lastScan: '2 min ago', intervalSec: 30, autoIndex: true },
  { id: 'f2', name: 'Indexed Uploads', path: '/mnt/alaes/scans/indexed', status: 'watching', files: 4297, lastScan: '5 min ago', intervalSec: 60, autoIndex: true },
  { id: 'f3', name: 'Doc-WARE Archive', path: '/mnt/alaes/docware/incoming', status: 'paused', files: 902, lastScan: '3 hr ago', intervalSec: 120, autoIndex: false },
  { id: 'f4', name: 'Survey Field Data', path: '/mnt/alaes/gis/field', status: 'watching', files: 361, lastScan: '11 min ago', intervalSec: 300, autoIndex: false },
]

export type SystemSettings = {
  orgName: string
  registryZone: string
  supportEmail: string
  timezone: string
  currency: string
  dateFormat: string
  sessionTimeout: number
  enforce2fa: boolean
  passwordExpiryDays: number
  ipAllowlist: boolean
  auditRetentionDays: number
  emailNotifications: boolean
  smsAlerts: boolean
  maintenanceMode: boolean
  autoBackup: boolean
  backupFrequency: string
}

export const DEFAULT_SETTINGS: SystemSettings = {
  orgName: 'Abia Land Administration Enterprise System',
  registryZone: 'Greater Umuahia',
  supportEmail: 'support@alaes.ab.gov.ng',
  timezone: '(GMT+01:00) West Africa Time — Lagos',
  currency: 'NGN — Nigerian Naira',
  dateFormat: 'DD MMM, YYYY',
  sessionTimeout: 30,
  enforce2fa: true,
  passwordExpiryDays: 90,
  ipAllowlist: false,
  auditRetentionDays: 365,
  emailNotifications: true,
  smsAlerts: false,
  maintenanceMode: false,
  autoBackup: true,
  backupFrequency: 'Daily at 02:00',
}

/* ------------------------------------------------------------------ */
/* Hierarchical Role Management (Create User)                          */
/* ------------------------------------------------------------------ */

export const USER_TYPES = ['Management', 'Operations', 'System', 'User', 'ALL'] as const
export type UserType = (typeof USER_TYPES)[number]

/** Step 3 — the user level is auto-derived from the selected user type. */
export const USER_LEVEL_BY_TYPE: Record<UserType, string> = {
  Management: 'Highest',
  Operations: 'High',
  System: 'Highest',
  User: 'Lowest',
  ALL: 'Lowest',
}

/** Officer ranks, ordered by seniority (most senior honored first). */
export const OFFICER_RANKS = [
  'Honorable Commissioner',
  'Permanent Secretary',
  'Director',
  'Deputy Director',
  'Assistant Director',
  'Officer',
  'HOS',
  'Director ICT',
  'ALL',
] as const

export type RoleGroup = 'ALL' | 'Operations' | 'Management' | 'System' | 'User'
export type AvailableRole = { name: string; group: RoleGroup; level: string }

/** The full module/role catalogue selectable when provisioning a user. */
export const AVAILABLE_ROLES: AvailableRole[] = [
  { name: 'Dashboard', group: 'ALL', level: 'Lowest' },
  { name: 'CRM - Person', group: 'ALL', level: 'Lowest' },
  { name: 'CRM - Corporate', group: 'ALL', level: 'Lowest' },
  { name: 'CRM - Customer Manager', group: 'Operations', level: 'High' },
  { name: 'Log a File', group: 'ALL', level: 'Lowest' },
  { name: 'File Tracker/Tracking', group: 'ALL', level: 'Lowest' },
  { name: 'File Digital Library - Doc-WARE', group: 'ALL', level: 'Lowest' },
  { name: 'Allocation', group: 'Management', level: 'Highest' },
  { name: 'Compensation/Resettlement', group: 'Operations', level: 'High' },
  { name: 'Recertification - Application', group: 'User', level: 'Lowest' },
  { name: 'Recertification - Bills & Payments', group: 'Operations', level: 'High' },
  { name: 'Recertification - Migrate Data', group: 'System', level: 'High' },
  { name: 'Recertification - Verification Sheet', group: 'Operations', level: 'High' },
  { name: 'GIS - Data Capture', group: 'Operations', level: 'High' },
  { name: 'Recertification - Vetting Sheet', group: 'Operations', level: 'High' },
  { name: 'Recertification - EDMS', group: 'User', level: 'Lowest' },
  { name: 'Recertification - Certification', group: 'Operations', level: 'High' },
  { name: "Recertification - DG's List", group: 'Operations', level: 'High' },
  { name: 'Recertification - Governors List', group: 'Operations', level: 'High' },
  { name: 'Conversion/Regularization', group: 'Operations', level: 'High' },
  { name: 'Land Property Enumeration - Data Repository', group: 'Operations', level: 'High' },
  { name: 'Land Property Enumeration - Migrate', group: 'System', level: 'High' },
  { name: 'Letter of Administration/Grant/Offer', group: 'Operations', level: 'High' },
  { name: 'Occupancy Permit (OP)', group: 'Operations', level: 'High' },
  { name: 'Billing', group: 'Operations', level: 'High' },
  { name: 'Generate Receipt', group: 'Operations', level: 'High' },
  { name: 'Land Use Charge (LUC)', group: 'Operations', level: 'High' },
  { name: 'Bill Balance', group: 'Operations', level: 'High' },
  { name: 'Deeds - Encumbrance', group: 'Operations', level: 'High' },
  { name: 'Deeds - Official (for filing purpose)', group: 'Operations', level: 'High' },
  { name: 'Deeds - On-Premise (Pay-Per-Search)', group: 'Operations', level: 'High' },
  { name: 'Deeds - Legal Search Reports', group: 'Operations', level: 'High' },
  { name: 'Lands - Generate New FileNo (MLSFileNo)', group: 'Operations', level: 'High' },
  { name: 'Lands - Capture an Existing File', group: 'User', level: 'Lowest' },
  { name: 'Lands - File Decommissioning', group: 'Operations', level: 'High' },
  { name: 'Survey - Records', group: 'Operations', level: 'High' },
  { name: 'Survey - AI Digital Assistant', group: 'Operations', level: 'High' },
  { name: 'Survey - GIS', group: 'Operations', level: 'High' },
  { name: 'Survey - Approvals', group: 'Management', level: 'Highest' },
  { name: 'Survey - E-Registry', group: 'Operations', level: 'High' },
  { name: 'Survey Reports', group: 'Operations', level: 'High' },
  { name: 'Cad - Records', group: 'Operations', level: 'High' },
  { name: 'Cad - AI Digital Assistant', group: 'Operations', level: 'High' },
  { name: 'Cad - GIS', group: 'Operations', level: 'High' },
  { name: 'Cad - Approvals', group: 'Management', level: 'Highest' },
  { name: 'Cad - E-Registry', group: 'Operations', level: 'High' },
  { name: 'Cadastral Reports', group: 'Operations', level: 'High' },
  { name: 'GIS - Records', group: 'Operations', level: 'High' },
  { name: 'GIS - AI Digital Assistant', group: 'Operations', level: 'High' },
  { name: 'GIS - GIS', group: 'Operations', level: 'High' },
  { name: 'GIS - Approvals', group: 'Management', level: 'Highest' },
  { name: 'GIS - e-Registry', group: 'Operations', level: 'High' },
  { name: 'GIS Reports', group: 'Operations', level: 'High' },
  { name: 'ST - Overview', group: 'ALL', level: 'Lowest' },
  { name: 'ST - Applications', group: 'User', level: 'Lowest' },
  { name: 'ST - Field Data Integration', group: 'Operations', level: 'High' },
  { name: 'ST - Bills & Payments', group: 'Operations', level: 'High' },
  { name: 'ST - Approvals (Other Departments)', group: 'Operations', level: 'High' },
  { name: 'ST - ST Memo', group: 'Operations', level: 'High' },
  { name: "ST - Director's Approval", group: 'Management', level: 'Highest' },
  { name: 'KANGIS - Digital Archive', group: 'Operations', level: 'High' },
  { name: 'Admin', group: 'Operations', level: 'High' },
  { name: 'DG', group: 'Operations', level: 'High' },
  { name: 'DGIS', group: 'Operations', level: 'High' },
  { name: 'Director GIS Recommendation', group: 'Management', level: 'High' },
  { name: 'DG Approval', group: 'Management', level: 'Highest' },
  { name: 'PRA', group: 'User', level: 'Lowest' },
  { name: 'Valuation', group: 'Operations', level: 'High' },
  { name: 'Deeds Registration', group: 'Operations', level: 'High' },
  { name: 'Other Applications', group: 'Operations', level: 'High' },
  { name: 'SLTR - Digital Archive', group: 'Operations', level: 'Highest' },
  { name: 'Deeds - Surrender', group: 'Operations', level: 'High' },
  { name: 'Indexing Activity Log', group: 'System', level: 'High' },
  { name: 'DCIV - Digital Archive', group: 'ALL', level: 'High' },
  { name: 'Land', group: 'Management', level: 'Highest' },
  { name: 'HC/PS View', group: 'Management', level: 'Highest' },
  { name: 'PRS', group: 'Operations', level: 'High' },
  { name: 'Transaction Token Control', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Land Records', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Field Data', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Bills & Payments', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Notice', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Other Departments', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Certificate', group: 'Operations', level: 'High' },
  { name: 'Special Assignment - Report', group: 'Operations', level: 'High' },
  { name: 'Parcel/Title Management-Land', group: 'Management', level: 'High' },
  { name: 'Duplex Parcel Update-Land', group: 'Management', level: 'High' },
  { name: 'Parcel/Title Management-Deeds', group: 'Management', level: 'High' },
  { name: 'Duplex Parcel Update-Deeds', group: 'Management', level: 'High' },
  { name: 'Match OP', group: 'User', level: 'High' },
]
