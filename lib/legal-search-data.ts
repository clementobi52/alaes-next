import type { Tone } from '@/components/system-admin/primitives'

export type RecordStatus = 'Verified' | 'Pending' | 'Archived' | 'Flagged'
export type PropertyRecord = {
  id: string
  fileNo: string
  owner: string
  property: string
  location: string
  landUse: string
  status: RecordStatus
  lastUpdated: string
  instrument: string
}

export const LEGAL_SEARCH_RECORDS: PropertyRecord[] = [
  { id: 'PR-001', fileNo: 'LABA/10482', owner: 'Chukwuemeka Obi', property: 'Plot 7, Zone A', location: 'Aba North', landUse: 'Residential', status: 'Verified', lastUpdated: '06 Sep 2026', instrument: 'RofO' },
  { id: 'PR-002', fileNo: 'LUM/1854', owner: 'Ngozi Adaeze', property: 'Block 8, Plot 23', location: 'Umuahia North', landUse: 'Commercial', status: 'Pending', lastUpdated: '05 Sep 2026', instrument: 'CofO' },
  { id: 'PR-003', fileNo: 'LUAC/AB/00127/AB', owner: 'Emeka Uche', property: 'Plot 12, Zone C', location: 'Aba South', landUse: 'Industrial', status: 'Verified', lastUpdated: '04 Sep 2026', instrument: 'Deed' },
  { id: 'PR-004', fileNo: 'LUM/OH/00319', owner: 'Ada Amaka', property: 'Layout 4, Plot 2', location: 'Ohafia', landUse: 'Residential', status: 'Flagged', lastUpdated: '02 Sep 2026', instrument: 'RofO' },
  { id: 'PR-005', fileNo: 'LABA/08731', owner: 'Ladan Trading Ltd', property: 'Factory Road Complex', location: 'Aba South', landUse: 'Mixed-Use', status: 'Archived', lastUpdated: '29 Aug 2026', instrument: 'Deed' },
  { id: 'PR-006', fileNo: 'LUM/02670', owner: 'Platinum Synergy Ltd', property: 'Umuahia Estate, Unit 4', location: 'Umuahia South', landUse: 'Residential', status: 'Verified', lastUpdated: '28 Aug 2026', instrument: 'CofO' },
]

export const SEARCH_TONES: Record<RecordStatus, Tone> = {
  Verified: 'green', Pending: 'amber', Archived: 'neutral', Flagged: 'red',
}

export const SEARCH_TYPES = ['Official filing purpose', 'On-premise pay-per-search'] as const
export const SEARCH_LOCATIONS = ['All locations', 'Aba North', 'Aba South', 'Ohafia', 'Umuahia North', 'Umuahia South'] as const
export const SEARCH_LAND_USES = ['All land uses', 'Residential', 'Commercial', 'Industrial', 'Mixed-Use'] as const

export const OFFICIAL_REQUESTS = [
  { id: 'OS-2026-091', reference: 'LABA/10482', requester: 'Ikechukwu & Partners', purpose: 'Due diligence / filing', status: 'Ready', submitted: '06 Sep 2026', fee: 'NGN 25,000' },
  { id: 'OS-2026-090', reference: 'LUM/1854', requester: 'Abia Legal Chambers', purpose: 'Mortgage registration', status: 'Processing', submitted: '05 Sep 2026', fee: 'NGN 25,000' },
  { id: 'OS-2026-089', reference: 'LUM/OH/00319', requester: 'O. Nwakanma Esq.', purpose: 'Court filing', status: 'Pending payment', submitted: '02 Sep 2026', fee: 'NGN 25,000' },
]

export const ON_PREMISE_REQUESTS = [
  { id: 'PS-2026-141', token: 'TKN-8F31', reference: 'LUAC/AB/00127/AB', requester: 'Uche & Co.', counter: 'Counter 02', status: 'In review', submitted: 'Today, 10:42' },
  { id: 'PS-2026-140', token: 'TKN-8F29', reference: 'LABA/08731', requester: 'Walk-in applicant', counter: 'Counter 01', status: 'Completed', submitted: 'Today, 09:18' },
  { id: 'PS-2026-139', token: 'TKN-8E88', reference: 'LUM/02670', requester: 'A. Okoro', counter: 'Counter 03', status: 'Awaiting record', submitted: 'Yesterday, 15:34' },
]

export function filterRecords(records: PropertyRecord[], query: string, location: string, landUse: string, status: string) {
  const q = query.trim().toLowerCase()
  return records.filter((record) => {
    const matchesQuery = !q || [record.fileNo, record.owner, record.property, record.location].some((field) => field.toLowerCase().includes(q))
    const matchesLocation = location === 'All locations' || record.location === location
    const matchesLandUse = landUse === 'All land uses' || record.landUse === landUse
    const matchesStatus = status === 'All statuses' || record.status === status
    return matchesQuery && matchesLocation && matchesLandUse && matchesStatus
  })
}
