import type { Tone } from '@/components/system-admin/primitives'

/* ------------------------------------------------------------------ */
/* Shared enums + tone mapping                                         */
/* ------------------------------------------------------------------ */

export type STStatus =
  | 'Pending'
  | 'Approved'
  | 'Declined'
  | 'Processing'
  | 'Captured'
  | 'Reserved'
  | 'Generated'
  | 'Expired'

export type LandUse = 'Residential' | 'Commercial' | 'Industrial' | 'Mixed-Use'
export type AppType = 'Mother' | 'Secondary' | 'Primary' | 'SuA' | 'PuA'

export function statusTone(status: STStatus): Tone {
  switch (status) {
    case 'Approved':
    case 'Captured':
    case 'Generated':
      return 'green'
    case 'Pending':
      return 'amber'
    case 'Declined':
    case 'Expired':
      return 'red'
    case 'Processing':
      return 'blue'
    case 'Reserved':
      return 'violet'
    default:
      return 'neutral'
  }
}

export function landUseTone(use: LandUse): Tone {
  switch (use) {
    case 'Residential':
      return 'blue'
    case 'Commercial':
      return 'green'
    case 'Industrial':
      return 'red'
    case 'Mixed-Use':
      return 'violet'
    default:
      return 'neutral'
  }
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

export const OVERVIEW_STATS = {
  motherApplications: 19,
  secondaryApplications: 75,
  certificatesIssued: 156,
  pendingApplications: 9,
}

export type MandateArea = {
  title: string
  icon: string
  items: string[]
}

export const SERVICE_AREAS: MandateArea[] = [
  {
    title: 'Customer Care',
    icon: 'users',
    items: ['Receive applications', 'Process payments', 'Collect documents', 'Digital archiving'],
  },
  {
    title: 'Planning',
    icon: 'layout-grid',
    items: ['Field validations', 'Compliance checks', 'Architectural reviews', 'Plan approvals'],
  },
  {
    title: 'Survey',
    icon: 'map-pin',
    items: ['Field mapping', 'Plan digitization', 'Reference numbers', '3D coordinates'],
  },
  {
    title: 'Operations',
    icon: 'settings',
    items: ['Process applications', 'Deed registration', 'Generate CofO', '3D modelling'],
  },
]

export const APPLICATION_FLOW = {
  mother: {
    title: 'Mother Application',
    description:
      'Submitted by the original property owner or developer to initiate sectional titling for the entire property.',
    steps: [
      'Property details and documentation',
      'Proposed unit layout and floor plans',
      'Define unit details and common property',
      'Generate participation quota',
      'Submit for departmental review',
    ],
  },
  secondary: {
    title: 'Secondary Application',
    description:
      'Submitted by individual unit buyers to claim ownership of specific sections within the property.',
    steps: [
      'Applicant information',
      'Select / confirm specific unit',
      'Upload proof of purchase',
      'Submit identity and supporting documents',
      'Generate individual CofO upon approval',
    ],
  },
}

export type RecentApplication = {
  fileNo: string
  type: 'Mother' | 'Secondary'
  applicant: string
  status: STStatus
}

export const RECENT_APPLICATIONS: RecentApplication[] = [
  { fileNo: 'LUAC/AB/1/AB', type: 'Mother', applicant: 'Chukwuemeka Obi', status: 'Pending' },
  { fileNo: 'ABIA 5567', type: 'Mother', applicant: 'Platinum Synergy Villas Limited', status: 'Pending' },
  { fileNo: 'LUM/3', type: 'Mother', applicant: 'Ladan Trading Company Limited', status: 'Pending' },
  { fileNo: 'LABA/4', type: 'Mother', applicant: 'Ngozi Adaeze', status: 'Approved' },
  { fileNo: 'LUM/OH/5', type: 'Mother', applicant: 'Chief Binta Okwara', status: 'Approved' },
  { fileNo: 'ST-COM-2026-4-001', type: 'Secondary', applicant: 'Dahiru Isa Umar', status: 'Pending' },
  { fileNo: 'ST-COM-2026-5-001', type: 'Secondary', applicant: 'Adaeze Amaka Nwosu', status: 'Pending' },
  { fileNo: 'ST-RES-2025-2-009', type: 'Secondary', applicant: 'Emeka Uche', status: 'Approved' },
]

/* ------------------------------------------------------------------ */
/* ST FileNo Management                                                */
/* ------------------------------------------------------------------ */

export const FILENO_STATS = {
  total: 128,
  primary: 74,
  sua: 39,
  pua: 15,
}

export type FileNoRecord = {
  sn: number
  stFileNo: string
  mlsFileNo: string
  applicant: string
  type: 'Primary' | 'SuA' | 'PuA'
  landUse: LandUse
  units: { allocated: number; total: number }
  year: number
  commissioningDate: string
  commissionedBy: string
  status: STStatus
}

export const FILENO_RECORDS: FileNoRecord[] = [
  { sn: 1, stFileNo: 'ST-RES-2026-14', mlsFileNo: 'LUAC/AB/1/AB', applicant: 'Chukwuemeka Obi', type: 'Primary', landUse: 'Residential', units: { allocated: 0, total: 3 }, year: 2026, commissioningDate: '2026-08-24', commissionedBy: 'NS Umar', status: 'Reserved' },
  { sn: 2, stFileNo: 'ST-COM-2026-08', mlsFileNo: 'LUAC/AB/2/UM', applicant: 'Platinum Synergy Villas Ltd', type: 'Primary', landUse: 'Commercial', units: { allocated: 4, total: 12 }, year: 2026, commissioningDate: '2026-08-19', commissionedBy: 'AO Okoro', status: 'Generated' },
  { sn: 3, stFileNo: 'ST-RES-2026-11', mlsFileNo: 'LUM/3', applicant: 'Ladan Trading Company Ltd', type: 'SuA', landUse: 'Residential', units: { allocated: 8, total: 8 }, year: 2026, commissioningDate: '2026-07-30', commissionedBy: 'EU Uche', status: 'Generated' },
  { sn: 4, stFileNo: 'ST-IND-2025-06', mlsFileNo: 'LABA/4', applicant: 'Ngozi Adaeze', type: 'PuA', landUse: 'Industrial', units: { allocated: 1, total: 2 }, year: 2025, commissioningDate: '2025-12-02', commissionedBy: 'UO Okonkwo', status: 'Reserved' },
  { sn: 5, stFileNo: 'ST-MIX-2025-19', mlsFileNo: 'LUM/OH/5', applicant: 'Chief Binta Okwara', type: 'Primary', landUse: 'Mixed-Use', units: { allocated: 6, total: 10 }, year: 2025, commissioningDate: '2025-11-18', commissionedBy: 'AA Amaka', status: 'Generated' },
  { sn: 6, stFileNo: 'ST-COM-2026-04', mlsFileNo: 'ST-COM-2026-4-001', applicant: 'Dahiru Isa Umar', type: 'SuA', landUse: 'Commercial', units: { allocated: 0, total: 5 }, year: 2026, commissioningDate: '2026-04-11', commissionedBy: 'NS Umar', status: 'Expired' },
  { sn: 7, stFileNo: 'ST-RES-2025-02', mlsFileNo: 'ST-RES-2025-2-009', applicant: 'Emeka Uche', type: 'PuA', landUse: 'Residential', units: { allocated: 9, total: 9 }, year: 2025, commissioningDate: '2025-02-27', commissionedBy: 'AO Okoro', status: 'Generated' },
  { sn: 8, stFileNo: 'ST-COM-2024-31', mlsFileNo: 'ABA 8821', applicant: 'Umuahia Mega Plaza Ltd', type: 'Primary', landUse: 'Commercial', units: { allocated: 18, total: 24 }, year: 2024, commissioningDate: '2024-09-05', commissionedBy: 'EU Uche', status: 'Generated' },
]

/* ------------------------------------------------------------------ */
/* FileNo nomenclature and schedules                                   */
/* ------------------------------------------------------------------ */

export const FILENO_PREFIXES = ['LUAC/AB', 'LUM', 'LABA', 'LUM/OH'] as const
export type FileNoPrefix = (typeof FILENO_PREFIXES)[number]
export const FILENO_SUFFIXES = ['AB', 'UM'] as const
export type FileNoSuffix = (typeof FILENO_SUFFIXES)[number]
export const FILENO_SCHEDULES = ['Aba', 'Ohafia', 'Umuahia'] as const
export type FileNoSchedule = (typeof FILENO_SCHEDULES)[number]

export const FILENO_SCHEDULE_RULES: Record<
  FileNoSchedule,
  { prefixes: FileNoPrefix[]; suffixes: FileNoSuffix[]; helper: string }
> = {
  Aba: {
    prefixes: ['LUAC/AB', 'LABA'],
    suffixes: ['AB', 'UM'],
    helper: 'Aba supports LUAC/AB with AB or UM suffixes, plus LABA legacy numbers.',
  },
  Ohafia: {
    prefixes: ['LUM/OH'],
    suffixes: [],
    helper: 'Ohafia uses the LUM/OH/xxxxx format.',
  },
  Umuahia: {
    prefixes: ['LUM'],
    suffixes: [],
    helper: 'Umuahia uses the LUM/xxxxx format.',
  },
}

export function buildFileNo(prefix: FileNoPrefix, sequence: number, suffix?: FileNoSuffix) {
  const number = String(sequence).padStart(5, '0')
  return prefix === 'LUAC/AB' ? `${prefix}/${number}/${suffix ?? 'AB'}` : `${prefix}/${number}`
}

export function isValidFileNoFormat(value: string) {
  return /^(LUAC\/AB\/\d{5}\/(AB|UM)|LUM\/\d{5}|LABA\/\d{5}|LUM\/OH\/\d{5})$/.test(value)
}

/* ------------------------------------------------------------------ */
/* Primary Applications                                                */
/* ------------------------------------------------------------------ */

export const PRIMARY_STATS = {
  total: 19,
  approved: 14,
  declined: 0,
  pending: 5,
}

export type ApprovalStage = { status: STStatus; date?: string }

export type PrimaryApplication = {
  stFileNo: string
  mlsFileNo: string
  property: string
  type: string
  landUse: LandUse
  owner: string
  passport?: string | null
  units: { allocated: number; total: number }
  applicationDate: string
  dateCreated: string
  createdBy: string
  jsiStatus: ApprovalStage
  jsiApproval: ApprovalStage
  planningRecommendation: ApprovalStage
  directorApproval: ApprovalStage
}

export const PRIMARY_APPLICATIONS: PrimaryApplication[] = [
  {
    stFileNo: 'ST-RES-2026-14', mlsFileNo: 'LUAC/AB/1/AB',
    property: 'Piece Of Land Ahmadu Bello Way, Umuahia', type: 'Fragmented Layout',
    landUse: 'Residential', owner: 'Chukwuemeka Obi', passport: '/images/primary-applications/nigerian_chukwudi_nwosu.jpg', units: { allocated: 0, total: 3 },
    applicationDate: '2026-08-07', dateCreated: '2026-08-24', createdBy: 'NS Umar',
    jsiStatus: { status: 'Captured', date: '2026-08-26' },
    jsiApproval: { status: 'Approved', date: '2026-09-04' },
    planningRecommendation: { status: 'Approved', date: '2026-09-04' },
    directorApproval: { status: 'Pending' },
  },
  {
    stFileNo: 'ST-COM-2026-08', mlsFileNo: 'LUAC/AB/2/UM',
    property: 'Plaza Complex, Aba Road, Aba', type: 'Story Building',
    landUse: 'Commercial', owner: 'Platinum Synergy Villas Ltd', passport: '/images/primary-applications/nigerian_ifeoma_okeke.jpg', units: { allocated: 4, total: 12 },
    applicationDate: '2026-07-15', dateCreated: '2026-07-30', createdBy: 'AO Okoro',
    jsiStatus: { status: 'Captured', date: '2026-08-01' },
    jsiApproval: { status: 'Approved', date: '2026-08-10' },
    planningRecommendation: { status: 'Approved', date: '2026-08-12' },
    directorApproval: { status: 'Approved', date: '2026-08-20' },
  },
  {
    stFileNo: 'ST-RES-2026-11', mlsFileNo: 'LUM/3',
    property: 'Residential Estate, Ohuhu, Umuahia', type: 'Fragmented Layout',
    landUse: 'Residential', owner: 'Ladan Trading Company Ltd', passport: '/images/primary-applications/nigerian_emeka_nnamdi.jpg', units: { allocated: 8, total: 8 },
    applicationDate: '2026-06-20', dateCreated: '2026-07-02', createdBy: 'EU Uche',
    jsiStatus: { status: 'Captured', date: '2026-07-05' },
    jsiApproval: { status: 'Approved', date: '2026-07-15' },
    planningRecommendation: { status: 'Pending' },
    directorApproval: { status: 'Pending' },
  },
  {
    stFileNo: 'ST-IND-2025-06', mlsFileNo: 'LABA/4',
    property: 'Industrial Layout, Osisioma, Aba', type: 'Warehouse Units',
    landUse: 'Industrial', owner: 'Ngozi Adaeze', passport: '/images/primary-applications/nigerian_ezinne_nwoke.jpg', units: { allocated: 1, total: 2 },
    applicationDate: '2025-11-10', dateCreated: '2025-12-02', createdBy: 'UO Okonkwo',
    jsiStatus: { status: 'Captured', date: '2025-12-05' },
    jsiApproval: { status: 'Approved', date: '2025-12-18' },
    planningRecommendation: { status: 'Approved', date: '2025-12-20' },
    directorApproval: { status: 'Approved', date: '2026-01-05' },
  },
  {
    stFileNo: 'ST-MIX-2025-19', mlsFileNo: 'LUM/OH/5',
    property: 'Mixed-Use Development, Factory Road, Aba', type: 'Multi-Unit',
    landUse: 'Mixed-Use', owner: 'Chief Binta Okwara', passport: '/images/primary-applications/nigerian_ikenna_igwe.jpg', units: { allocated: 6, total: 10 },
    applicationDate: '2025-10-01', dateCreated: '2025-11-18', createdBy: 'AA Amaka',
    jsiStatus: { status: 'Captured', date: '2025-11-20' },
    jsiApproval: { status: 'Approved', date: '2025-12-01' },
    planningRecommendation: { status: 'Approved', date: '2025-12-03' },
    directorApproval: { status: 'Approved', date: '2025-12-15' },
  },
]

/* ------------------------------------------------------------------ */
/* Unit Applications — shared shape                                    */
/* ------------------------------------------------------------------ */

export const ALLOCATION_SOURCES = ['State Government', 'Local Government'] as const
export type AllocationSource = (typeof ALLOCATION_SOURCES)[number]

/** A single sectional unit moving through the approval pipeline. */
export type UnitApplication = {
  schemeNo: string
  npFileNo: string // parent / primary (mother) file number
  unitFileNo: string
  unitNo: string
  landUse: LandUse
  allocationSource: AllocationSource
  allocationEntity: string
  unitOwner: string
  phone: string
  applicationDate: string
  dateCaptured: string
  createdBy: string
  jsiStatus: ApprovalStage
  jsiApproval: ApprovalStage
  planningRecommendation: ApprovalStage
  directorApproval: ApprovalStage
}

/** Roll a unit's four pipeline stages into one headline status. */
export function unitOverallStatus(u: UnitApplication): STStatus {
  if (u.directorApproval.status === 'Approved') return 'Approved'
  if (
    u.jsiApproval.status === 'Declined' ||
    u.planningRecommendation.status === 'Declined' ||
    u.directorApproval.status === 'Declined'
  )
    return 'Declined'
  return 'Pending'
}

/* ------------------------------------------------------------------ */
/* Parented Units (units under a mother/primary scheme)                */
/* ------------------------------------------------------------------ */

export const PARENTED_STATS = {
  motherSchemes: 4,
  totalUnits: 11,
  approved: 5,
  pending: 6,
}

export type MotherScheme = {
  schemeNo: string
  motherFileNo: string
  property: string
  developer: string
  landUse: LandUse
  totalUnits: number
  units: UnitApplication[]
}

export const PARENTED_SCHEMES: MotherScheme[] = [
  {
    schemeNo: 'ST/SP/0008',
    motherFileNo: 'ST-COM-2026-08',
    property: 'Plaza Complex, Aba Road, Aba',
    developer: 'Platinum Synergy Villas Ltd',
    landUse: 'Commercial',
    totalUnits: 12,
    units: [
      { schemeNo: 'ST/SP/0008', npFileNo: 'ST-COM-2026-08', unitFileNo: 'ST-COM-2026-08-001', unitNo: 'Shop A1', landUse: 'Commercial', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Emeka Uche', phone: '0803 461 2290', applicationDate: '2026-07-18', dateCaptured: '2026-08-01', createdBy: 'AO Okoro', jsiStatus: { status: 'Captured', date: '2026-08-02' }, jsiApproval: { status: 'Approved', date: '2026-08-10' }, planningRecommendation: { status: 'Approved', date: '2026-08-12' }, directorApproval: { status: 'Approved', date: '2026-08-20' } },
      { schemeNo: 'ST/SP/0008', npFileNo: 'ST-COM-2026-08', unitFileNo: 'ST-COM-2026-08-002', unitNo: 'Shop A2', landUse: 'Commercial', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Ada Amaka', phone: '0806 552 8134', applicationDate: '2026-07-18', dateCaptured: '2026-08-01', createdBy: 'AO Okoro', jsiStatus: { status: 'Captured', date: '2026-08-02' }, jsiApproval: { status: 'Approved', date: '2026-08-10' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
      { schemeNo: 'ST/SP/0008', npFileNo: 'ST-COM-2026-08', unitFileNo: 'ST-COM-2026-08-003', unitNo: 'Office B1', landUse: 'Commercial', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Uche Okonkwo', phone: '0701 223 9087', applicationDate: '2026-07-20', dateCaptured: '2026-08-03', createdBy: 'EU Uche', jsiStatus: { status: 'Captured', date: '2026-08-04' }, jsiApproval: { status: 'Approved', date: '2026-08-12' }, planningRecommendation: { status: 'Approved', date: '2026-08-14' }, directorApproval: { status: 'Pending' } },
    ],
  },
  {
    schemeNo: 'ST/SP/0011',
    motherFileNo: 'ST-RES-2026-11',
    property: 'Residential Estate, Ohuhu, Umuahia',
    developer: 'Ladan Trading Company Ltd',
    landUse: 'Residential',
    totalUnits: 8,
    units: [
      { schemeNo: 'ST/SP/0011', npFileNo: 'ST-RES-2026-11', unitFileNo: 'ST-RES-2026-11-001', unitNo: 'Block 1 Flat 1', landUse: 'Residential', allocationSource: 'Local Government', allocationEntity: 'Umuahia North LGA', unitOwner: 'Ngozi Adaeze', phone: '0813 770 4521', applicationDate: '2026-06-22', dateCaptured: '2026-07-02', createdBy: 'EU Uche', jsiStatus: { status: 'Captured', date: '2026-07-05' }, jsiApproval: { status: 'Approved', date: '2026-07-15' }, planningRecommendation: { status: 'Approved', date: '2026-07-18' }, directorApproval: { status: 'Approved', date: '2026-07-30' } },
      { schemeNo: 'ST/SP/0011', npFileNo: 'ST-RES-2026-11', unitFileNo: 'ST-RES-2026-11-002', unitNo: 'Block 1 Flat 2', landUse: 'Residential', allocationSource: 'Local Government', allocationEntity: 'Umuahia North LGA', unitOwner: 'Chukwuemeka Obi', phone: '0902 118 3365', applicationDate: '2026-06-22', dateCaptured: '2026-07-02', createdBy: 'EU Uche', jsiStatus: { status: 'Captured', date: '2026-07-05' }, jsiApproval: { status: 'Approved', date: '2026-07-15' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
    ],
  },
  {
    schemeNo: 'ST/SP/0019',
    motherFileNo: 'ST-MIX-2025-19',
    property: 'Mixed-Use Development, Factory Road, Aba',
    developer: 'Chief Binta Okwara',
    landUse: 'Mixed-Use',
    totalUnits: 10,
    units: [
      { schemeNo: 'ST/SP/0019', npFileNo: 'ST-MIX-2025-19', unitFileNo: 'ST-MIX-2025-19-001', unitNo: 'Suite 1', landUse: 'Mixed-Use', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Platinum Synergy Ltd', phone: '0805 664 2201', applicationDate: '2025-10-05', dateCaptured: '2025-11-18', createdBy: 'AA Amaka', jsiStatus: { status: 'Captured', date: '2025-11-20' }, jsiApproval: { status: 'Approved', date: '2025-12-01' }, planningRecommendation: { status: 'Approved', date: '2025-12-03' }, directorApproval: { status: 'Approved', date: '2025-12-15' } },
      { schemeNo: 'ST/SP/0019', npFileNo: 'ST-MIX-2025-19', unitFileNo: 'ST-MIX-2025-19-002', unitNo: 'Suite 2', landUse: 'Mixed-Use', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Umuahia Mega Plaza Ltd', phone: '0703 552 7789', applicationDate: '2025-10-05', dateCaptured: '2025-11-18', createdBy: 'AA Amaka', jsiStatus: { status: 'Captured', date: '2025-11-20' }, jsiApproval: { status: 'Approved', date: '2025-12-01' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
    ],
  },
  {
    schemeNo: 'ST/SP/0006',
    motherFileNo: 'ST-IND-2025-06',
    property: 'Industrial Layout, Osisioma, Aba',
    developer: 'Ngozi Adaeze',
    landUse: 'Industrial',
    totalUnits: 2,
    units: [
      { schemeNo: 'ST/SP/0006', npFileNo: 'ST-IND-2025-06', unitFileNo: 'ST-IND-2025-06-001', unitNo: 'Warehouse 1', landUse: 'Industrial', allocationSource: 'Local Government', allocationEntity: 'Osisioma Ngwa LGA', unitOwner: 'Ladan Trading Ltd', phone: '0816 443 1120', applicationDate: '2025-11-12', dateCaptured: '2025-12-02', createdBy: 'UO Okonkwo', jsiStatus: { status: 'Captured', date: '2025-12-05' }, jsiApproval: { status: 'Approved', date: '2025-12-18' }, planningRecommendation: { status: 'Approved', date: '2025-12-20' }, directorApproval: { status: 'Approved', date: '2026-01-05' } },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Standalone Unit Applications (SUA — no mother application)          */
/* ------------------------------------------------------------------ */

export const STANDALONE_STATS = {
  total: 6,
  approved: 2,
  pending: 4,
  rejected: 0,
}

export const STANDALONE_APPLICATIONS: UnitApplication[] = [
  { schemeNo: 'ST/SP/0025', npFileNo: 'ST-COM-2026-4', unitFileNo: 'ST-COM-2026-4-001', unitNo: 'Unit 1', landUse: 'Commercial', allocationSource: 'Local Government', allocationEntity: 'Aba South LGA', unitOwner: 'Dahiru Isa Umar', phone: '0803 145 9921', applicationDate: '2026-04-06', dateCaptured: '2026-04-11', createdBy: 'NS Umar', jsiStatus: { status: 'Captured', date: '2026-04-12' }, jsiApproval: { status: 'Approved', date: '2026-04-20' }, planningRecommendation: { status: 'Approved', date: '2026-04-22' }, directorApproval: { status: 'Approved', date: '2026-05-02' } },
  { schemeNo: 'ST/SP/0026', npFileNo: 'ST-COM-2026-5', unitFileNo: 'ST-COM-2026-5-001', unitNo: 'Unit 1', landUse: 'Commercial', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Adaeze Amaka Nwosu', phone: '0806 774 2018', applicationDate: '2026-05-02', dateCaptured: '2026-05-09', createdBy: 'AO Okoro', jsiStatus: { status: 'Captured', date: '2026-05-10' }, jsiApproval: { status: 'Approved', date: '2026-05-19' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
  { schemeNo: 'ST/SP/0027', npFileNo: 'ST-RES-2025-2', unitFileNo: 'ST-RES-2025-2-009', unitNo: 'Flat 9', landUse: 'Residential', allocationSource: 'Local Government', allocationEntity: 'Umuahia South LGA', unitOwner: 'Emeka Uche', phone: '0701 998 5540', applicationDate: '2025-02-14', dateCaptured: '2025-02-27', createdBy: 'EU Uche', jsiStatus: { status: 'Captured', date: '2025-03-01' }, jsiApproval: { status: 'Approved', date: '2025-03-10' }, planningRecommendation: { status: 'Approved', date: '2025-03-12' }, directorApproval: { status: 'Approved', date: '2025-03-25' } },
  { schemeNo: 'ST/SP/0028', npFileNo: 'ST-RES-2026-7', unitFileNo: 'ST-RES-2026-7-003', unitNo: 'Flat 3', landUse: 'Residential', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Chief Binta Okwara', phone: '0813 220 6674', applicationDate: '2026-03-11', dateCaptured: '2026-03-18', createdBy: 'AA Amaka', jsiStatus: { status: 'Captured', date: '2026-03-19' }, jsiApproval: { status: 'Pending' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
  { schemeNo: 'ST/SP/0029', npFileNo: 'ST-IND-2026-2', unitFileNo: 'ST-IND-2026-2-001', unitNo: 'Bay 1', landUse: 'Industrial', allocationSource: 'Local Government', allocationEntity: 'Osisioma Ngwa LGA', unitOwner: 'Umuahia Mega Plaza Ltd', phone: '0902 445 1176', applicationDate: '2026-02-20', dateCaptured: '2026-02-28', createdBy: 'UO Okonkwo', jsiStatus: { status: 'Captured', date: '2026-03-01' }, jsiApproval: { status: 'Pending' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
  { schemeNo: 'ST/SP/0030', npFileNo: 'ST-COM-2026-9', unitFileNo: 'ST-COM-2026-9-002', unitNo: 'Shop 2', landUse: 'Commercial', allocationSource: 'State Government', allocationEntity: 'Abia State Govt', unitOwner: 'Platinum Synergy Ltd', phone: '0805 331 8890', applicationDate: '2026-06-01', dateCaptured: '2026-06-08', createdBy: 'NS Umar', jsiStatus: { status: 'Captured', date: '2026-06-09' }, jsiApproval: { status: 'Pending' }, planningRecommendation: { status: 'Pending' }, directorApproval: { status: 'Pending' } },
]
