import type { LucideIcon } from 'lucide-react'
import {
  Package,
  Briefcase,
  Building2,
  ShieldCheck,
  Search,
  Clock,
  FileText,
  Landmark,
} from 'lucide-react'

/** Institution categories that may onboard onto the public PHS portal. */
export type InstitutionType = 'bank' | 'law_firm' | 'corporate'

export const INSTITUTION_LABELS: Record<InstitutionType, string> = {
  bank: 'Bank / Financial Institution',
  law_firm: 'Law Firm',
  corporate: 'Corporate Organization',
}

/** Access role assigned to a team member inside an organization. */
export type AccessRole = 'search_only' | 'report_viewer' | 'analytics_viewer'
export type UserType = 'super_admin' | 'regular_user'

export type OrgUser = {
  id: number
  name: string
  email: string
  jobTitle: string
  department: string
  userType: UserType
  accessRole: AccessRole
  tokensUsed: number
  status: 'active' | 'suspended'
  joinedDate: string
}

export type ActivityEntry = {
  action: string
  user: string
  timestamp: string
  type: 'user' | 'settings' | 'search' | 'billing'
}

export type OrgSettings = {
  name: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string | null
  bannerUrl: string | null
}

export type Organization = {
  id: string
  name: string
  type: InstitutionType
  password: string
  tokens: number
  settings: OrgSettings
  users: OrgUser[]
  activityLog: ActivityEntry[]
}

/** Token packages offered on the portal. Prices are in Nigerian Naira. */
export type TokenPackage = {
  id: string
  name: string
  tokens: number
  price: number
  icon: LucideIcon
  accent: string
  popular?: boolean
}

export const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 'starter', name: 'Starter', tokens: 2000, price: 50000, icon: Package, accent: 'emerald' },
  { id: 'professional', name: 'Professional', tokens: 5000, price: 100000, icon: Briefcase, accent: 'blue', popular: true },
  { id: 'enterprise', name: 'Enterprise', tokens: 10000, price: 180000, icon: Building2, accent: 'violet' },
]

export const NAIRA = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

/** Seed organizations used for the simulated demo sign-in. */
export const SEED_ORGANIZATIONS: Record<string, Organization> = {
  abia_trust: {
    id: 'abia_trust',
    name: 'Abia Trust Bank',
    type: 'bank',
    password: 'demo123',
    tokens: 5000,
    settings: {
      name: 'Abia Trust Bank',
      primaryColor: '#0b5c3f',
      secondaryColor: '#d4af37',
      logoUrl: null,
      bannerUrl: null,
    },
    users: [
      { id: 1, name: 'Ndubuisi Eze', email: 'n.eze@abiatrust.com', jobTitle: 'IT Director', department: 'Technology', userType: 'super_admin', accessRole: 'search_only', tokensUsed: 245, status: 'active', joinedDate: '2025-01-15' },
      { id: 2, name: 'Adaeze Nwankwo', email: 'a.nwankwo@abiatrust.com', jobTitle: 'Legal Officer', department: 'Legal', userType: 'regular_user', accessRole: 'report_viewer', tokensUsed: 89, status: 'active', joinedDate: '2025-01-16' },
    ],
    activityLog: [
      { action: 'User created', user: 'n.eze@abiatrust.com', timestamp: '2025-01-15 10:30 AM', type: 'user' },
      { action: 'Branding updated', user: 'System', timestamp: '2025-01-20 09:00 AM', type: 'settings' },
    ],
  },
  okoro_partners: {
    id: 'okoro_partners',
    name: 'Okoro & Partners Legal',
    type: 'law_firm',
    password: 'demo123',
    tokens: 3200,
    settings: {
      name: 'Okoro & Partners Legal',
      primaryColor: '#7a1f2b',
      secondaryColor: '#c0c0c0',
      logoUrl: null,
      bannerUrl: null,
    },
    users: [
      { id: 1, name: 'Chidi Okoro', email: 'c.okoro@okoropartners.com', jobTitle: 'Managing Partner', department: 'Executive', userType: 'super_admin', accessRole: 'search_only', tokensUsed: 156, status: 'active', joinedDate: '2025-01-10' },
      { id: 2, name: 'Ngozi Alozie', email: 'n.alozie@okoropartners.com', jobTitle: 'Senior Associate', department: 'Legal', userType: 'regular_user', accessRole: 'report_viewer', tokensUsed: 67, status: 'active', joinedDate: '2025-01-12' },
      { id: 3, name: 'Emeka Onuoha', email: 'e.onuoha@okoropartners.com', jobTitle: 'Legal Researcher', department: 'Research', userType: 'regular_user', accessRole: 'search_only', tokensUsed: 34, status: 'active', joinedDate: '2025-01-15' },
    ],
    activityLog: [
      { action: 'Organization created', user: 'c.okoro@okoropartners.com', timestamp: '2025-01-10 11:00 AM', type: 'user' },
      { action: 'User added', user: 'n.alozie@okoropartners.com', timestamp: '2025-01-12 02:30 PM', type: 'user' },
    ],
  },
}

/** Rotating hero slides for the landing page. */
export const HERO_SLIDES = [
  {
    title: 'Verified Land Records at Your Fingertips',
    subtitle: 'Run official legal searches across Abia State property records in seconds.',
    accent: 'from-emerald-700 to-emerald-500',
  },
  {
    title: 'Trusted by Banks & Law Firms',
    subtitle: 'Institutional-grade due diligence backed by the state land registry.',
    accent: 'from-blue-700 to-blue-500',
  },
  {
    title: 'Transparent. Fast. Reliable.',
    subtitle: 'Every search produces a printable, audit-ready legal search report.',
    accent: 'from-violet-700 to-violet-500',
  },
]

export const PORTAL_STATS = [
  { label: 'Records indexed', value: '4,297+' },
  { label: 'Institutions onboarded', value: '128' },
  { label: 'Searches processed', value: '39,540' },
  { label: 'Avg. turnaround', value: '< 5s' },
]

export const PORTAL_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Search, title: 'Instant Legal Search', body: 'Search by file number, ABIAGIS number, owner, plot, or layout and get results instantly.' },
  { icon: ShieldCheck, title: 'Government-Backed Records', body: 'Every record is sourced directly from the Abia State land administration database.' },
  { icon: FileText, title: 'Printable Search Reports', body: 'Generate official, audit-ready legal search slips ready for filing and due diligence.' },
  { icon: Clock, title: 'Pay-as-you-go Tokens', body: 'Buy token packages and spend one token per search — no subscriptions required.' },
  { icon: Landmark, title: 'Institutional Accounts', body: 'Onboard your bank, law firm, or corporate team with role-based access controls.' },
  { icon: Building2, title: 'Organization Branding', body: 'Customize your portal with your logo, banner, and brand colors for your team.' },
]

export const PORTAL_ORG = {
  name: 'Abia State Land Administration & E-Governance System',
  short: 'ALAES Public Legal Search',
  email: 'support@alaes.ab.gov.ng',
  phone: '+234 (0) 8 000 0000',
  address: 'ALAES Headquarters, Umuahia, Abia State, Nigeria',
}
