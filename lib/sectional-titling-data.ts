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
  { fileNo: 'ABA-RC-1982-294', type: 'Mother', applicant: 'Chukwuemeka Obi', status: 'Pending' },
  { fileNo: 'ABIA 5567', type: 'Mother', applicant: 'Platinum Synergy Villas Limited', status: 'Pending' },
  { fileNo: 'UMU 1536', type: 'Mother', applicant: 'Ladan Trading Company Limited', status: 'Pending' },
  { fileNo: 'ABA-RC-1982-663', type: 'Mother', applicant: 'Ngozi Adaeze', status: 'Approved' },
  { fileNo: 'ABA-RC-1987-16', type: 'Mother', applicant: 'Chief Binta Okwara', status: 'Approved' },
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
  { sn: 1, stFileNo: 'ST-RES-2026-14', mlsFileNo: 'ABA-RC-1982-294', applicant: 'Chukwuemeka Obi', type: 'Primary', landUse: 'Residential', units: { allocated: 0, total: 3 }, year: 2026, commissioningDate: '2026-08-24', commissionedBy: 'NS Umar', status: 'Reserved' },
  { sn: 2, stFileNo: 'ST-COM-2026-08', mlsFileNo: 'ABA 5567', applicant: 'Platinum Synergy Villas Ltd', type: 'Primary', landUse: 'Commercial', units: { allocated: 4, total: 12 }, year: 2026, commissioningDate: '2026-08-19', commissionedBy: 'AO Okoro', status: 'Generated' },
  { sn: 3, stFileNo: 'ST-RES-2026-11', mlsFileNo: 'UMU 1536', applicant: 'Ladan Trading Company Ltd', type: 'SuA', landUse: 'Residential', units: { allocated: 8, total: 8 }, year: 2026, commissioningDate: '2026-07-30', commissionedBy: 'EU Uche', status: 'Generated' },
  { sn: 4, stFileNo: 'ST-IND-2025-06', mlsFileNo: 'ABA-RC-1982-663', applicant: 'Ngozi Adaeze', type: 'PuA', landUse: 'Industrial', units: { allocated: 1, total: 2 }, year: 2025, commissioningDate: '2025-12-02', commissionedBy: 'UO Okonkwo', status: 'Reserved' },
  { sn: 5, stFileNo: 'ST-MIX-2025-19', mlsFileNo: 'ABA-RC-1987-16', applicant: 'Chief Binta Okwara', type: 'Primary', landUse: 'Mixed-Use', units: { allocated: 6, total: 10 }, year: 2025, commissioningDate: '2025-11-18', commissionedBy: 'AA Amaka', status: 'Generated' },
  { sn: 6, stFileNo: 'ST-COM-2026-04', mlsFileNo: 'ST-COM-2026-4-001', applicant: 'Dahiru Isa Umar', type: 'SuA', landUse: 'Commercial', units: { allocated: 0, total: 5 }, year: 2026, commissioningDate: '2026-04-11', commissionedBy: 'NS Umar', status: 'Expired' },
  { sn: 7, stFileNo: 'ST-RES-2025-02', mlsFileNo: 'ST-RES-2025-2-009', applicant: 'Emeka Uche', type: 'PuA', landUse: 'Residential', units: { allocated: 9, total: 9 }, year: 2025, commissioningDate: '2025-02-27', commissionedBy: 'AO Okoro', status: 'Generated' },
  { sn: 8, stFileNo: 'ST-COM-2024-31', mlsFileNo: 'ABA 8821', applicant: 'Umuahia Mega Plaza Ltd', type: 'Primary', landUse: 'Commercial', units: { allocated: 18, total: 24 }, year: 2024, commissioningDate: '2024-09-05', commissionedBy: 'EU Uche', status: 'Generated' },
]

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
    stFileNo: 'ST-RES-2026-14', mlsFileNo: 'ABA-RC-1982-294',
    property: 'Piece Of Land Ahmadu Bello Way, Umuahia', type: 'Fragmented Layout',
    landUse: 'Residential', owner: 'Chukwuemeka Obi', units: { allocated: 0, total: 3 },
    applicationDate: '2026-08-07', dateCreated: '2026-08-24', createdBy: 'NS Umar',
    jsiStatus: { status: 'Captured', date: '2026-08-26' },
    jsiApproval: { status: 'Approved', date: '2026-09-04' },
    planningRecommendation: { status: 'Approved', date: '2026-09-04' },
    directorApproval: { status: 'Pending' },
  },
  {
    stFileNo: 'ST-COM-2026-08', mlsFileNo: 'ABA 5567',
    property: 'Plaza Complex, Aba Road, Aba', type: 'Story Building',
    landUse: 'Commercial', owner: 'Platinum Synergy Villas Ltd', units: { allocated: 4, total: 12 },
    applicationDate: '2026-07-15', dateCreated: '2026-07-30', createdBy: 'AO Okoro',
    jsiStatus: { status: 'Captured', date: '2026-08-01' },
    jsiApproval: { status: 'Approved', date: '2026-08-10' },
    planningRecommendation: { status: 'Approved', date: '2026-08-12' },
    directorApproval: { status: 'Approved', date: '2026-08-20' },
  },
  {
    stFileNo: 'ST-RES-2026-11', mlsFileNo: 'UMU 1536',
    property: 'Residential Estate, Ohuhu, Umuahia', type: 'Fragmented Layout',
    landUse: 'Residential', owner: 'Ladan Trading Company Ltd', units: { allocated: 8, total: 8 },
    applicationDate: '2026-06-20', dateCreated: '2026-07-02', createdBy: 'EU Uche',
    jsiStatus: { status: 'Captured', date: '2026-07-05' },
    jsiApproval: { status: 'Approved', date: '2026-07-15' },
    planningRecommendation: { status: 'Pending' },
    directorApproval: { status: 'Pending' },
  },
  {
    stFileNo: 'ST-IND-2025-06', mlsFileNo: 'ABA-RC-1982-663',
    property: 'Industrial Layout, Osisioma, Aba', type: 'Warehouse Units',
    landUse: 'Industrial', owner: 'Ngozi Adaeze', units: { allocated: 1, total: 2 },
    applicationDate: '2025-11-10', dateCreated: '2025-12-02', createdBy: 'UO Okonkwo',
    jsiStatus: { status: 'Captured', date: '2025-12-05' },
    jsiApproval: { status: 'Approved', date: '2025-12-18' },
    planningRecommendation: { status: 'Approved', date: '2025-12-20' },
    directorApproval: { status: 'Approved', date: '2026-01-05' },
  },
  {
    stFileNo: 'ST-MIX-2025-19', mlsFileNo: 'ABA-RC-1987-16',
    property: 'Mixed-Use Development, Factory Road, Aba', type: 'Multi-Unit',
    landUse: 'Mixed-Use', owner: 'Chief Binta Okwara', units: { allocated: 6, total: 10 },
    applicationDate: '2025-10-01', dateCreated: '2025-11-18', createdBy: 'AA Amaka',
    jsiStatus: { status: 'Captured', date: '2025-11-20' },
    jsiApproval: { status: 'Approved', date: '2025-12-01' },
    planningRecommendation: { status: 'Approved', date: '2025-12-03' },
    directorApproval: { status: 'Approved', date: '2025-12-15' },
  },
]
